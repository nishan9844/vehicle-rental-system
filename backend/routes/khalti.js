const express = require('express');
const axios = require('axios');

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

        return res.status(502).json({
            message: 'Failed to initiate Khalti payment',
            details: err?.response?.data || err.message,
        });
    }
});

router.post('/verify', async (req, res) => {
    const { pidx } = req.body;
    const headers = khaltiHeaders();

    if (!pidx) {
        return res.status(400).json({
            message: 'pidx is required',
        });
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
            return res.json({
                success: true,
                status,
                transaction_id,
                booking_id: purchase_order_id,
                amount_paisa: total_amount,
            });
        }

        return res.json({
            success: false,
            status,
            message: `Payment not completed. Status: ${status}`,
        });
    } catch (err) {
        console.error('Khalti lookup error:', err?.response?.data || err.message);

        return res.status(502).json({
            message: 'Failed to verify Khalti payment',
            details: err?.response?.data || err.message,
        });
    }
});

module.exports = router;
