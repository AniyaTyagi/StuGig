import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      this.socket = io(import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'https://stugig.onrender.com', {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 10000,
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect_error', (error) => {
        console.warn('Socket connection error:', error.message);
      });

      this.socket.on('disconnect', (reason) => {
        console.warn('Socket disconnected:', reason);
      });
    } catch (error) {
      console.error('Socket connect error:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (this.socket) this.socket.on(event, callback);
  }

  off(event, callback) {
    if (this.socket) this.socket.off(event, callback);
  }

  emit(event, data) {
    if (this.socket) this.socket.emit(event, data);
  }

  joinConversation(conversationId) {
    this.emit('joinConversation', conversationId);
  }

  sendMessage(data) {
    this.emit('sendMessage', data);
  }

  typing(data) {
    this.emit('typing', data);
  }

  stopTyping(data) {
    this.emit('stopTyping', data);
  }
}

export default new SocketService();
