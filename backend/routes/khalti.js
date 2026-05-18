const express = require('express');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const KHALTI_BASE_URL =
    process.env.KHALTI_BASE_URL || 'https://dev.khalti.com/api/v2';

const DEFAULT_FRONTEND_URL = 'http://localhost:3000';

function khaltiHeaders() {
    if (!process.env.KHALTI_SECRET_KEY) {
        return null;
    }

    return {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
    };
}

function formatErrorDetails(details) {
    if (!details) return '';
    return typeof details === 'string' ? details : JSON.stringify(details);
}

function getSupabaseAdmin() {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey || serviceRoleKey === 'your_service_role_key_here') {
        return null;
    }

    return createClient(url, serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}

async function markBookingPaid(bookingId) {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
        return {
            updated: false,
            warning: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured; frontend callback will try the booking update.',
        };
    }

    const { error } = await supabase
        .from('bookings')
        .update({
            status: 'confirmed',
            payment_status: 'paid',
        })
        .eq('id', bookingId);

    if (error) throw error;

    return { updated: true };
}

router.post('/initiate', async (req, res) => {
    const {
        booking_id,
        amount_npr,
        customer_name,
        customer_email,
        customer_phone,
    } = req.body;

    const amount = Number(amount_npr);
    const headers = khaltiHeaders();

    if (!booking_id || amount_npr === undefined) {
        return res.status(400).json({
            message: 'booking_id and amount_npr are required',
        });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({
            message: 'amount_npr must be a positive number',
        });
    }

    if (!headers) {
        return res.status(500).json({
            message: 'KHALTI_SECRET_KEY is not configured',
        });
    }

    const frontendUrl = process.env.FRONTEND_URL || DEFAULT_FRONTEND_URL;

    try {
        const response = await axios.post(
            `${KHALTI_BASE_URL}/epayment/initiate/`,
            {
                return_url: `${frontendUrl}/payment/khalti-callback`,
                website_url: frontendUrl,
                amount: Math.round(amount * 100),
                purchase_order_id: String(booking_id),
                purchase_order_name: `Vehicle Booking #${booking_id}`,
                customer_info: {
                    name: customer_name || 'Customer',
                    email: customer_email || '',
                    phone: customer_phone || '',
                },
            },
            { headers }
        );

        return res.json({
            pidx: response.data.pidx,
            payment_url: response.data.payment_url,
        });
    } catch (err) {
        console.error('Khalti initiate error:', err?.response?.data || err.message);

        const details = err?.response?.data || err.message;
        const detailsText = formatErrorDetails(details);

        return res.status(502).json({
            message: detailsText
                ? `Failed to initiate Khalti payment: ${detailsText}`
                : 'Failed to initiate Khalti payment',
            details,
        });
    }
});

router.post('/verify', async (req, res) => {
    const { pidx } = req.body;
    const headers = khaltiHeaders();

    if (!pidx) {
        return res.status(400).json({ message: 'pidx is required' });
    }

    if (!headers) {
        return res.status(500).json({
            message: 'KHALTI_SECRET_KEY is not configured',
        });
    }

    try {
        const response = await axios.post(
            `${KHALTI_BASE_URL}/epayment/lookup/`,
            { pidx },
            { headers }
        );

        const {
            status,
            transaction_id,
            total_amount,
            purchase_order_id,
        } = response.data;

        if (status === 'Completed') {
            const booking_id = purchase_order_id;
            const dbResult = await markBookingPaid(booking_id);

            return res.json({
                success: true,
                status,
                transaction_id,
                booking_id,
                amount_paisa: total_amount,
                backend_update: dbResult.updated,
                warning: dbResult.warning,
            });
        }

        return res.json({
            success: false,
            status,
            message: `Payment not completed. Status: ${status}`,
        });
    } catch (err) {
        console.error('Khalti lookup/update error:', err?.response?.data || err.message);

        const details = err?.response?.data || err.message;
        const detailsText = formatErrorDetails(details);

        return res.status(502).json({
            message: detailsText
                ? `Failed to verify Khalti payment: ${detailsText}`
                : 'Failed to verify Khalti payment',
            details,
        });
    }
});

module.exports = router;
