import api from './api';

export const bidService = {
  createBid: (data) => api.post('/bids', data),
  getMyBids: () => api.get('/bids/my-bids'),
  getBidById: (id) => api.get(`/bids/${id}`),
  acceptBid: (id) => api.put(`/bids/${id}/accept`),
  rejectBid: (id) => api.put(`/bids/${id}/reject`),
  withdrawBid: (id) => api.put(`/bids/${id}/withdraw`),
  getBidSuggestions: (jobId) => api.get(`/bids/suggestions/${jobId}`),
};

export const messageService = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (conversationId, params) => api.get(`/messages/${conversationId}`, { params }),
  sendMessage: (data) => api.post('/messages', data),
  markAsRead: (conversationId) => api.put(`/messages/${conversationId}/read`),
};

export const paymentService = {
  createPayment: (data) => api.post('/payments', data),
  getPayments: () => api.get('/payments'),
  getPaymentById: (id) => api.get(`/payments/${id}`),
  releasePayment: (id) => api.put(`/payments/${id}/release`),
  refundPayment: (id) => api.put(`/payments/${id}/refund`),
  createPaymentIntent: (data) => api.post('/payments/create-intent', data),
};

export const notificationService = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export const reviewService = {
  createReview: (data) => api.post('/reviews', data),
  getMyReviews: () => api.get('/reviews/my-reviews'),
  getReviewsByUser: (userId) => api.get(`/reviews/user/${userId}`),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export const aiService = {
  getJobRecommendations: (limit = 10) => api.get(`/ai/job-recommendations?limit=${limit}`),
  getBiddingSuggestions: (jobId) => api.get(`/ai/bidding-suggestions/${jobId}`),
  getFreelancerRecommendations: (jobId, limit = 10) => api.get(`/ai/freelancer-recommendations/${jobId}?limit=${limit}`),
  getCompatibilityScore: (freelancerId, jobId) => api.get(`/ai/compatibility/${freelancerId}/${jobId}`),
  submitFeedback: (matchId, feedback) => api.post(`/ai/feedback/${matchId}`, feedback),
  // Legacy endpoints (kept for backward compatibility)
  getJobMatchScore: (jobId) => api.get(`/ai/job-match/${jobId}`),
  getRecommendedJobs: () => api.get('/ai/recommended-jobs'),
  getBidSuggestions: (jobId) => api.get(`/ai/bid-suggestions/${jobId}`),
};

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (userId, data) => api.put(`/admin/users/${userId}/status`, data),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  moderateJob: (jobId, data) => api.put(`/admin/jobs/${jobId}/moderate`, data),
  moderateReview: (reviewId, data) => api.put(`/admin/reviews/${reviewId}/moderate`, data),
  getAdminLogs: (params) => api.get('/admin/logs', { params }),
};
