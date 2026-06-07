/**
 * AI Controller - Intelligent Matchmaking & Recommendations
 * @description Provides AI-powered job matching and bidding assistance
 */

const aiService = require('../services/ai.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Get AI-powered job recommendations for freelancer
 * @route GET /api/v1/ai/job-recommendations
 */
exports.getJobRecommendations = catchAsync(async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const recommendations = await aiService.getRecommendedJobsForFreelancer(
      req.user._id,
      parseInt(limit)
    );

    ApiResponse.success(res, {
      count: recommendations.length,
      recommendations
    }, 'AI job recommendations generated successfully');
  } catch (error) {
    console.error('getJobRecommendations error:', error);
    ApiResponse.success(res, {
      count: 0,
      recommendations: []
    }, 'No recommendations available at this time');
  }
});

/**
 * Get AI bidding suggestions for a specific job
 * @route GET /api/v1/ai/bidding-suggestions/:jobId
 */
exports.getBiddingSuggestions = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  
  const suggestions = await aiService.generateBiddingSuggestions(
    jobId,
    req.user._id
  );

  ApiResponse.success(res, suggestions, 'AI bidding suggestions generated successfully');
});

/**
 * Get recommended freelancers for a job (for clients)
 * @route GET /api/v1/ai/freelancer-recommendations/:jobId
 */
exports.getFreelancerRecommendations = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const { limit = 10 } = req.query;
  
  const recommendations = await aiService.getRecommendedFreelancersForJob(
    jobId,
    parseInt(limit)
  );

  ApiResponse.success(res, {
    count: recommendations.length,
    recommendations
  }, 'AI freelancer recommendations generated successfully');
});

/**
 * Get match compatibility score between freelancer and job
 * @route GET /api/v1/ai/compatibility/:freelancerId/:jobId
 */
exports.getCompatibilityScore = catchAsync(async (req, res) => {
  const { freelancerId, jobId } = req.params;
  
  const User = require('../models/User');
  const Job = require('../models/Job');
  
  const freelancer = await User.findById(freelancerId);
  const job = await Job.findById(jobId);
  
  if (!freelancer || !job) {
    return res.status(404).json({ message: 'Freelancer or job not found' });
  }
  
  const compatibility = await aiService.calculateCompatibilityScore(freelancer, job);
  
  ApiResponse.success(res, compatibility, 'Compatibility score calculated successfully');
});

/**
 * Get AI accuracy metrics
 * @route GET /api/v1/ai/metrics
 */
exports.getAIMetrics = catchAsync(async (req, res) => {
  const metrics = await aiService.getAccuracyMetrics();
  
  ApiResponse.success(res, metrics, 'AI metrics retrieved successfully');
});

/**
 * Submit feedback on AI recommendation
 * @route POST /api/v1/ai/feedback/:matchId
 */
exports.submitFeedback = catchAsync(async (req, res) => {
  const { matchId } = req.params;
  const { helpful, reason } = req.body;
  
  await aiService.updateMatchOutcome(matchId, 'feedback_received', {
    'userFeedback.helpful': helpful,
    'userFeedback.reason': reason,
    'userFeedback.timestamp': new Date()
  });
  
  ApiResponse.success(res, null, 'Feedback submitted successfully');
});
