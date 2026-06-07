import api from './api';

const aiService = {
  getJobRecommendations: (limit = 10) => 
    api.get(`/ai/job-recommendations?limit=${limit}`),

  getBiddingSuggestions: (jobId) => 
    api.get(`/ai/bidding-suggestions/${jobId}`),

  getFreelancerRecommendations: (jobId, limit = 10) => 
    api.get(`/ai/freelancer-recommendations/${jobId}?limit=${limit}`),

  getCompatibilityScore: (freelancerId, jobId) => 
    api.get(`/ai/compatibility/${freelancerId}/${jobId}`),

  submitFeedback: (matchId, feedback) => 
    api.post(`/ai/feedback/${matchId}`, feedback)
};

export default aiService;
