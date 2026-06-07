const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const users = new Map();

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.userId);
    users.set(socket.userId, socket.id);
    
    // Join user's personal room for notifications
    socket.join(socket.userId);
    
    io.emit('userOnline', socket.userId);

    socket.on('joinConversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} joined conversation: ${conversationId}`);
    });

    socket.on('sendMessage', async (data) => {
      const { conversationId, content, receiverId } = data;
      
      io.to(`conversation:${conversationId}`).emit('newMessage', {
        conversationId,
        content,
        senderId: socket.userId,
        createdAt: new Date()
      });

      // Send notification to receiver
      if (receiverId) {
        io.to(receiverId).emit('notification', {
          type: 'message',
          title: 'New Message',
          message: 'You have a new message',
          relatedId: conversationId,
          createdAt: new Date()
        });
      }
    });

    socket.on('typing', (data) => {
      socket.to(`conversation:${data.conversationId}`).emit('userTyping', {
        userId: socket.userId,
        conversationId: data.conversationId
      });
    });

    socket.on('stopTyping', (data) => {
      socket.to(`conversation:${data.conversationId}`).emit('userStoppedTyping', {
        userId: socket.userId,
        conversationId: data.conversationId
      });
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.userId);
      users.delete(socket.userId);
      io.emit('userOffline', socket.userId);
    });
  });

  // Make io available to notification service
  const notificationService = require('../services/notification.service');
  notificationService.setIO(io);

  return io;
};

module.exports = initSocket;
