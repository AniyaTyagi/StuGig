/**
 * Review Routes
 * @module routes/reviews
 * @description Rating and review system endpoints
 * @version 1.0.0
 */

const express = require('express');
const { createReview, getUserReviews, getServiceReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

/**
 * @route   POST /api/v1/reviews
 * @desc    Create a new review
 * @access  Private
 */
router.post('/', protect, createReview);

/**
 * @route   GET /api/v1/reviews/user/:userId
 * @desc    Get all reviews for a specific user
 * @access  Public
 */
router.get('/user/:userId', getUserReviews);

/**
 * @route   GET /api/v1/reviews/service/:serviceId
 * @desc    Get all reviews for a specific service
 * @access  Public
 */
router.get('/service/:serviceId', getServiceReviews);

/**
 * @route   DELETE /api/v1/reviews/:id
 * @desc    Delete a review
 * @access  Private (Owner only)
 */
router.delete('/:id', protect, deleteReview);

module.exports = router;
