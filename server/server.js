const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const { allowedOrigins } = require('./config/security.config');
const app = require('./app');
require('./config/mongoose.config');


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
