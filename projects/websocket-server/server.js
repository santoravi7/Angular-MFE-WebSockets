const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"]
  }
});

let liveUsers = new Set();

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
 
  if(userId){
    liveUsers.add(userId);
  }

  console.log(`New connection: ${socket.id}, Live users: ${liveUsers.size}`);
  
  // Send updated live user count to all clients
  io.emit('liveUsers', liveUsers.size);

  socket.on('message', (data) => {
    messageData = {
      user: data.user,
      message: data.message,
    }
    
    console.log(`Message from ${userId}: ${messageData}`);
    io.emit('message', messageData);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    liveUsers.delete(userId);
    console.log(`User disconnected: ${socket.id}, Live users: ${liveUsers.size}`);
    io.emit('liveUsers', liveUsers.size);
  });
});

// Start server
server.listen(4000, () => {
  console.log('WebSocket server running on port 4000');
});
