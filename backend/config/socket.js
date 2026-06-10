const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const onlineUsers = new Map();

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'https://stugig-frontend-aniya-tyagi-s-projects.vercel.app?_vercel_share=OCMtrh89wA33mFA7ZyJO4oYhXiL58jcO', 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);
    onlineUsers.set(socket.userId, socket.id);
    
    socket.broadcast.emit('user-online', socket.userId);

    socket.on('join-conversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('send-message', (data) => {
      const { conversationId, receiverId, message } = data;
      io.to(conversationId).emit('receive-message', message);
      
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new-message-notification', message);
      }
    });

    socket.on('typing', (data) => {
      const { conversationId, receiverId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user-typing', { userId: socket.userId, conversationId });
      }
    });

    socket.on('stop-typing', (data) => {
      const { conversationId, receiverId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user-stop-typing', { userId: socket.userId, conversationId });
      }
    });

    socket.on('notification', (data) => {
      const receiverSocketId = onlineUsers.get(data.userId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new-notification', data.notification);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
      onlineUsers.delete(socket.userId);
      socket.broadcast.emit('user-offline', socket.userId);
    });
  });

  return io;
};

module.exports = { initializeSocket, onlineUsers };
