import api from './api';

export const paymentService = {
  createPayment: (data) => api.post('/payments', data),
  createPaymentIntent: (data) => api.post('/payments/create-intent', data),
  getPayments: () => api.get('/payments'),
  getPaymentById: (id) => api.get(`/payments/${id}`),
  releasePayment: (id) => api.put(`/payments/${id}/release`),
  refundPayment: (id) => api.put(`/payments/${id}/refund`),
};
