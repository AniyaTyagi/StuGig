import api from './api';

export const bidService = {
  createBid: (data) => api.post('/bids', data),
  getJobBids: (jobId) => api.get(`/bids/job/${jobId}`),
  getMyBids: () => api.get('/bids/my-bids'),
  acceptBid: (bidId) => api.patch(`/bids/${bidId}/accept`),
  rejectBid: (bidId) => api.patch(`/bids/${bidId}/reject`)
};

export default bidService;
