require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');
const khaltiRouter = require('./routes/khalti');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
}));

app.use(express.json());

app.use('/api/khalti', khaltiRouter);

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Backend running on port ${PORT}`);
    });
}

module.exports = app;
