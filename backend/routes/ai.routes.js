/**
 * AI Routes
 * @module routes/ai
 * @description AI-powered recommendations and intelligent matchmaking
 * @version 2.0.0
 */

const express = require('express');
const { 
  getJobRecommendations, 
  getBiddingSuggestions,
  getFreelancerRecommendations,
  getCompatibilityScore,
  getAIMetrics,
  submitFeedback
} = require('../controllers/aiController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// All AI routes require authentication
router.use(protect);

/**
 * @route   GET /api/v1/ai/job-recommendations
 * @desc    Get AI-powered job recommendations for freelancer
 * @access  Private (Student/Freelancer)
 */
router.get('/job-recommendations', 
  authorize('student', 'freelancer'), 
  getJobRecommendations
);

/**
 * @route   GET /api/v1/ai/bidding-suggestions/:jobId
 * @desc    Get AI bidding suggestions for a specific job
 * @access  Private (Student/Freelancer)
 */
router.get('/bidding-suggestions/:jobId', 
  authorize('student', 'freelancer'), 
  getBiddingSuggestions
);

/**
 * @route   GET /api/v1/ai/freelancer-recommendations/:jobId
 * @desc    Get AI-recommended freelancers for a job
 * @access  Private (Recruiter/Startup/Client)
 */
router.get('/freelancer-recommendations/:jobId', 
  authorize('recruiter', 'startup', 'client'), 
  getFreelancerRecommendations
);

/**
 * @route   GET /api/v1/ai/compatibility/:freelancerId/:jobId
 * @desc    Get compatibility score between freelancer and job
 * @access  Private
 */
router.get('/compatibility/:freelancerId/:jobId', 
  getCompatibilityScore
);

/**
 * @route   GET /api/v1/ai/metrics
 * @desc    Get AI accuracy and performance metrics
 * @access  Private (Admin)
 */
router.get('/metrics', 
  authorize('admin'), 
  getAIMetrics
);

/**
 * @route   POST /api/v1/ai/feedback/:matchId
 * @desc    Submit feedback on AI recommendation
 * @access  Private
 */
router.post('/feedback/:matchId', 
  submitFeedback
);

module.exports = router;
