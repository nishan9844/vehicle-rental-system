const express = require('express');
const { getSupabaseAdmin, getUserFromAuthorization } = require('../lib/supabaseAdmin');

const router = express.Router();

function buildPaymentCode(method, bookingId) {
    return `${String(method || 'PAY').toUpperCase()}-${bookingId}-${Date.now()}`;
}

function isPaymentStatusConstraintError(error) {
    return error?.code === '23514'
        && String(error?.message || '').includes('payments_status_check');
}

async function insertPayment(supabase, payload) {
    let insertPayload = { ...payload };
    let error = null;

    for (let attempt = 0; attempt < 10; attempt += 1) {
        const result = await supabase.from('payments').insert([insertPayload]);
        error = result.error;

        if (!error) {
            return;
        }

        const missingColumn = String(error.message || '').match(/'([^']+)' column/)?.[1];

        if (error.code === 'PGRST204' && missingColumn && insertPayload[missingColumn] !== undefined) {
            const { [missingColumn]: _removed, ...nextPayload } = insertPayload;
            insertPayload = nextPayload;
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

    if (error) throw error;
}

async function getUserRole(supabase, userId) {
    const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

    return String(data?.role || 'user').toLowerCase();
}

router.post('/record', async (req, res) => {
    try {
        const supabase = getSupabaseAdmin();

        if (!supabase) {
            return res.status(500).json({
                success: false,
                message: 'Supabase admin credentials are missing on the backend.',
            });
        }

        const { user, error: userError } = await getUserFromAuthorization(req);

        if (userError || !user) {
            return res.status(401).json({
                success: false,
                message: userError?.message || 'Authentication is required.',
            });
        }

        const {
            booking_id,
            method = 'card',
            transaction_id,
        } = req.body || {};

        if (!booking_id) {
            return res.status(400).json({
                success: false,
                message: 'booking_id is required.',
            });
        }

        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('id,user_id,full_name,email,total_price,status,payment_status')
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
        const ownsBooking = booking.user_id === user.id;

        if (!ownsBooking && role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to update this booking.',
            });
        }

        const paymentMethod = String(method || 'card').toLowerCase();
        const transactionId = transaction_id || `${paymentMethod.toUpperCase()}-${booking.id}-${Date.now()}`;

        const { data: existingPayment, error: existingError } = await supabase
            .from('payments')
            .select('id')
            .eq('transaction_id', transactionId)
            .maybeSingle();

        if (existingError) throw existingError;

        const { error: bookingUpdateError } = await supabase
            .from('bookings')
            .update({
                status: 'confirmed',
                payment_status: 'paid',
                updated_at: new Date().toISOString(),
            })
            .eq('id', booking.id);

        if (bookingUpdateError) throw bookingUpdateError;

        if (!existingPayment) {
            await insertPayment(supabase, {
                    payment_code: buildPaymentCode(paymentMethod, booking.id),
                    booking_id: booking.id,
                    customer_name: booking.full_name || 'Customer',
                    customer_email: booking.email || '',
                    method: paymentMethod,
                    amount: Number(booking.total_price || 0),
                    status: 'paid',
                    transaction_id: transactionId,
                    paid_at: new Date().toISOString(),
                });
        }

        return res.json({
            success: true,
            booking_id: booking.id,
            transaction_id: transactionId,
            payment_recorded: Boolean(existingPayment) ? 'existing' : 'inserted',
        });
    } catch (err) {
        console.error('Payment record error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Unable to record payment.',
        });
    }
});

module.exports = router;
