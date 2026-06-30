const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { allowedOrigins, isProduction } = require('./config/security.config');
const { csrfProtection, issueCsrfToken } = require('./middleware/csrf');
const path = require('path');
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/api/csrf-token', issueCsrfToken);
app.use(csrfProtection);
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/api/assets', express.static(path.join(__dirname, 'public', 'assets')));
require('./config/mongoose.config');
require('./routes/user.routes')(app);
require('./routes/foodItem.routes')(app);
require('./routes/order.routes')(app);
require('./routes/admin.routes')(app);


const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
