require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: false,
}));
app.use(express.json({ limit: '100kb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const khaltiRoutes = require('./routes/khalti');
const paymentRoutes = require('./routes/payments');

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/khalti', paymentLimiter, khaltiRoutes);
app.use('/api/payments', paymentLimiter, paymentRoutes);
app.use('/api/admin', adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error.',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
