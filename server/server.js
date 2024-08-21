const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const path=require('path')
const app = express();
const _dirname = path.dirname("")
const buildPath = path.join(_dirname  , "../client/dist");

app.use(express.static(buildPath))

app.get("/*", function(req, res){

    res.sendFile(
        path.join(__dirname, "../client/dist/index.html"),
        function (err) {
          if (err) {
            res.status(500).send(err);
          }
        }
      );

})

const PORT = process.env.PORT || 8000;

app.use(cookieParser());
app.use(cors({ credentials: true, origin: ['http://localhost:5173'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

require('./config/mongoose.config');
require('./routes/foodDelivery.routes')(app);
require('./routes/user.routes')(app);
require('./routes/foodItem.routes')(app);
require('./routes/order.routes')(app);
require('./routes/admin.routes')(app);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
