const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}))
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  console.log('New client connected: ', socket.id);

  socket.on('join-room', roomId => {
    socket.join(roomId);
    console.log(`Client ${socket.id} joined room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected: ', socket.id);
  });

  socket.on('engine-update', payload => {
    const { room_name } = payload;
    console.log(`Forwarding update to room ${room_name}:`, payload);
    io.to(room_name).emit('engine-update', payload);
  })
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});