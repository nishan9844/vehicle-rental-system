const express = require('express');
const axios = require('axios');
const { getSupabaseAdmin, getUserFromAuthorization, getUserRole } = require('../lib/supabaseAdmin');

const router = express.Router();

const KHALTI_BASE_URL = (
    process.env.KHALTI_BASE_URL || 'https://dev.khalti.com/api/v2'
).replace(/\/$/, '');
const KHALTI_TEST_AMOUNT_NPR = Number(process.env.KHALTI_TEST_AMOUNT_NPR || 0);

const DEFAULT_FRONTEND_URL = 'http://localhost:3000';

function khaltiHeaders() {
    if (
        !process.env.KHALTI_SECRET_KEY ||
        process.env.KHALTI_SECRET_KEY === 'your_khalti_secret_key_here'
    ) {
        return null;
    }

    return {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
    };
}

function formatErrorDetails(details) {
    if (!details) return '';

    return typeof details === 'string'
        ? details
        : JSON.stringify(details);
}

function buildPaymentCode(bookingId) {
    return `KHALTI-${bookingId}-${Date.now()}`;
}

function isPaymentStatusConstraintError(error) {
    return error?.code === '23514'
        && String(error?.message || '').includes('payments_status_check');
}

async function markBookingPaid(bookingId) {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
        return {
            updated: false,
            warning:
                'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured.',
        };
    }

    const { error } = await supabase
        .from('bookings')
        .update({
            status: 'confirmed',
            payment_status: 'paid',
            updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId);

    if (error) {
        throw error;
    }

    return { updated: true };
}

async function recordPayment(bookingId, khaltiPayment) {
    if (!bookingId || bookingId === 'undefined') {
        return {
            inserted: false,
            warning: 'Booking id was not available from Khalti callback.',
        };
    }

    const supabase = getSupabaseAdmin();

    if (!supabase) {
        return {
            inserted: false,
            warning:
                'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured.',
        };
    }

    const { data: existingPayment, error: existingError } = await supabase
        .from('payments')
        .select('id')
        .eq('transaction_id', khaltiPayment.transaction_id)
        .maybeSingle();

    if (existingError) {
        console.warn('Unable to check existing payment:', existingError.message);
    }

    if (existingPayment) {
        return { inserted: false, existing: true };
    }

    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('full_name,email,total_price')
        .eq('id', bookingId)
        .maybeSingle();

    if (bookingError) {
        console.warn('Unable to fetch booking for payment row:', bookingError.message);
    }

    const bookingTotal = Number(booking?.total_price || 0);
    const amount = bookingTotal || Number(khaltiPayment.total_amount || 0) / 100;

    const payload = {
        payment_code: buildPaymentCode(bookingId),
        booking_id: bookingId,
        customer_name: booking?.full_name || 'Customer',
        customer_email: booking?.email || '',
        method: 'khalti',
        amount,
        status: 'paid',
        transaction_id: khaltiPayment.transaction_id,
        paid_at: new Date().toISOString(),
    };

    let insertPayload = { ...payload };
    let error = null;

    for (let attempt = 0; attempt < 10; attempt += 1) {
        const result = await supabase.from('payments').insert([insertPayload]);
        error = result.error;

        if (!error) {
            return { inserted: true };
        }

        const missingColumn = String(error.message || '').match(/'([^']+)' column/)?.[1];

        if (error.code === 'PGRST204' && missingColumn && insertPayload[missingColumn] !== undefined) {
            delete insertPayload[missingColumn];
            continue;
        }

        if (isPaymentStatusConstraintError(error) && insertPayload.status === 'paid') {
            insertPayload = {
                ...insertPayload,
                status: 'completed',
            };
            continue;
        }

        break;
    }

    if (error) {
        throw error;
    }

    return { inserted: false };
}

router.post('/initiate', async (req, res) => {
    try {
        const supabase = getSupabaseAdmin();
        const { user, error: userError } = await getUserFromAuthorization(req);

        if (userError || !user) {
            return res.status(401).json({
                success: false,
                message: userError?.message || 'Authentication is required.',
            });
        }

        const {
            booking_id,
            amount_npr,
            customer_name,
            customer_email,
            customer_phone,
        } = req.body;

        const headers = khaltiHeaders();

        if (!booking_id || amount_npr === undefined) {
            return res.status(400).json({
                success: false,
                message: 'booking_id and amount_npr are required',
            });
        }

        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('id,user_id,total_price')
            .eq('id', booking_id)
            .maybeSingle();

        if (bookingError) throw bookingError;

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking was not found.',
            });
        }

        const role = await getUserRole(supabase, user.id);

        if (booking.user_id !== user.id && role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to pay for this booking.',
            });
        }

        const amount = Number(booking.total_price || amount_npr);

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'amount_npr must be a positive number',
            });
        }

        if (!headers) {
            return res.status(500).json({
                success: false,
                message: 'KHALTI_SECRET_KEY is missing',
            });
        }

        const frontendUrl =
            process.env.FRONTEND_URL || DEFAULT_FRONTEND_URL;

        const khaltiAmount =
            KHALTI_BASE_URL.includes('dev.khalti.com') && KHALTI_TEST_AMOUNT_NPR > 0
                ? KHALTI_TEST_AMOUNT_NPR
                : amount;

        const payload = {
            return_url: `${frontendUrl}/payment/khalti-callback`,
            website_url: frontendUrl,
            amount: Math.round(khaltiAmount * 100),
            purchase_order_id: String(booking_id),
            purchase_order_name: `Vehicle Booking #${booking_id}`,
            merchant_extra: JSON.stringify({
                booking_id,
                booking_total_npr: amount,
                khalti_amount_npr: khaltiAmount,
            }),
            customer_info: {
                name: customer_name || 'Customer',
                email: customer_email || '',
                phone: customer_phone || '',
            },
        };

        const response = await axios.post(
            `${KHALTI_BASE_URL}/epayment/initiate/`,
            payload,
            { headers }
        );

        return res.json({
            success: true,
            pidx: response.data.pidx,
            payment_url: response.data.payment_url,
        });
    } catch (err) {
        console.error(
            'Khalti initiate error:',
            err?.response?.data || err.message
        );

        const details = err?.response?.data || err.message;

        return res.status(502).json({
            success: false,
            message: 'Failed to initiate Khalti payment',
            details: formatErrorDetails(details),
        });
    }
});

router.post('/verify', async (req, res) => {
    try {
        const { pidx, booking_id: callbackBookingId } = req.body;

        const headers = khaltiHeaders();

        if (!pidx) {
            return res.status(400).json({
                success: false,
                message: 'pidx is required',
            });
        }

        if (!headers) {
            return res.status(500).json({
                success: false,
                message: 'KHALTI_SECRET_KEY is missing',
            });
        }

        const response = await axios.post(
            `${KHALTI_BASE_URL}/epayment/lookup/`,
            { pidx },
            { headers }
        );

        console.log('Khalti verify response:', response.data);

        const {
            status,
            transaction_id,
            total_amount,
            purchase_order_id,
        } = response.data;

        if (status !== 'Completed') {
            return res.status(400).json({
                success: false,
                status,
                message: `Payment not completed. Status: ${status}`,
            });
        }

        const booking_id = purchase_order_id || callbackBookingId;

        const warnings = [];
        let dbResult = { updated: false };
        let paymentResult = { inserted: false };

        if (!booking_id || booking_id === 'undefined') {
            warnings.push('Booking id was not returned by Khalti lookup or callback.');
        } else {
            try {
                dbResult = await markBookingPaid(booking_id);
                if (dbResult.warning) warnings.push(dbResult.warning);
            } catch (dbError) {
                console.error('Booking update failed after Khalti success:', dbError);
                warnings.push(`Booking update failed: ${dbError.message}`);
            }

            try {
                paymentResult = await recordPayment(booking_id, response.data);
                if (paymentResult.warning) warnings.push(paymentResult.warning);
            } catch (paymentError) {
                console.error('Payment row insert failed after Khalti success:', paymentError);
                warnings.push(`Payment row insert failed: ${paymentError.message}`);
            }
        }

        return res.json({
            success: true,
            status,
            transaction_id,
            booking_id,
            amount_paisa: total_amount,
            backend_update: dbResult.updated,
            payment_recorded: paymentResult.inserted || paymentResult.existing || false,
            warning: warnings.join(' '),
        });
    } catch (err) {
        console.error(
            'Khalti verify error:',
            err?.response?.data || err.message
        );

        const details = err?.response?.data || err.message;

        return res.status(502).json({
            success: false,
            message: 'Failed to verify Khalti payment',
            details: formatErrorDetails(details),
        });
    }
});

module.exports = router;
