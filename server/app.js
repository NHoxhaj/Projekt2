const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');
const { allowedOrigins, isProduction } = require('./config/security.config');
const { csrfProtection, issueCsrfToken } = require('./middleware/csrf');

const app = express();

if (isProduction) {
  app.set('trust proxy', 1);
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login/register attempts. Please try again later.' },
});

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many order requests. Please try again later.' },
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: allowedOrigins,
}));
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);
app.use('/api/admin/login', authLimiter);
app.use('/api/admin/register', authLimiter);
app.use('/api/orders', orderLimiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.get('/api/csrf-token', issueCsrfToken);
app.use(csrfProtection);
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/api/assets', express.static(path.join(__dirname, 'public', 'assets')));

require('./routes/user.routes')(app);
require('./routes/foodItem.routes')(app);
require('./routes/order.routes')(app);
require('./routes/admin.routes')(app);

module.exports = app;
