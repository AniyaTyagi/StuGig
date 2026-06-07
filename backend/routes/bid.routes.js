/**
 * Bid Routes
 * @module routes/bids
 * @description Bidding system for job proposals
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const { 
  createBid, 
  getJobBids, 
  getMyBids, 
  acceptBid, 
  rejectBid,
  deleteBid 
} = require('../controllers/bidController');
const { protect, authorize } = require('../middlewares/auth');

/**
 * @route   POST /api/v1/bids
 * @desc    Create a new bid on a job
 * @access  Private (Student/Freelancer)
 */
router.post('/', protect, authorize('student', 'freelancer'), createBid);

/**
 * @route   GET /api/v1/bids/my-bids
 * @desc    Get all bids created by current user
 * @access  Private (Student/Freelancer)
 */
router.get('/my-bids', protect, authorize('student', 'freelancer'), getMyBids);

/**
 * @route   GET /api/v1/bids/job/:jobId
 * @desc    Get all bids for a specific job
 * @access  Public
 */
router.get('/job/:jobId', getJobBids);

/**
 * @route   PATCH /api/v1/bids/:id/accept
 * @desc    Accept a bid and assign job to freelancer
 * @access  Private (Recruiter/Startup/Client)
 */
router.patch('/:id/accept', protect, authorize('recruiter', 'startup', 'client'), acceptBid);

/**
 * @route   PATCH /api/v1/bids/:id/reject
 * @desc    Reject a bid
 * @access  Private (Recruiter/Startup/Client)
 */
router.patch('/:id/reject', protect, authorize('recruiter', 'startup', 'client'), rejectBid);

/**
 * @route   DELETE /api/v1/bids/:id
 * @desc    Delete a bid
 * @access  Private (Student/Freelancer)
 */
router.delete('/:id', protect, authorize('student', 'freelancer'), deleteBid);

module.exports = router;
