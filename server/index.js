const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.post('/api/initiate-khalti', async (req, res) => {
    const { booking_id, amount, customer_info } = req.body;
    if (!booking_id || !amount) return res.status(400).json({ error: 'booking_id and amount are required' });

    try {
        const response = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', {
            method: 'POST',
            headers: {
                'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                return_url: `${process.env.FRONTEND_URL}/payment/verify?booking_id=${booking_id}`,
                website_url: process.env.FRONTEND_URL,
                amount: Math.round(amount * 100),
                purchase_order_id: String(booking_id),
                purchase_order_name: `Vehicle Rental Booking #${booking_id}`,
                customer_info: customer_info || {},
            }),
        });

        const data = await response.json();
        if (!response.ok) return res.status(400).json({ error: 'Khalti initiation failed', details: data });
        res.json({ payment_url: data.payment_url, pidx: data.pidx });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/verify-khalti', async (req, res) => {
    const { pidx } = req.query;
    if (!pidx) return res.status(400).json({ error: 'pidx is required' });

    try {
        const response = await fetch('https://a.khalti.com/api/v2/epayment/lookup/', {
            method: 'POST',
            headers: {
                'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pidx }),
        });

        const data = await response.json();
        if (!response.ok) return res.status(400).json({ error: 'Verification failed', details: data });
        res.json({ success: data.status === 'Completed', status: data.status, transaction_id: data.transaction_id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(process.env.PORT || 5000, () => console.log(`Backend on http://localhost:${process.env.PORT || 5000}`));