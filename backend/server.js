const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const khaltiRoutes = require('./routes/khalti');
const paymentRoutes = require('./routes/payments');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/khalti', khaltiRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;
