import api from './api';

export const messageService = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (conversationId, params) => api.get(`/messages/${conversationId}`, { params }),
  sendMessage: (data) => api.post('/messages', data),
  markAsRead: (conversationId) => api.put(`/messages/${conversationId}/read`),
};
