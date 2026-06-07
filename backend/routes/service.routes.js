/**
 * Service Routes
 * @module routes/services
 * @description Service (Gig) marketplace endpoints
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const { 
  createService, 
  getServices, 
  getServiceById, 
  updateService, 
  deleteService,
  getFreelancerServices 
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middlewares/auth');

/**
 * @route   POST /api/v1/services
 * @desc    Create a new service listing
 * @access  Private (Student/Freelancer)
 */
/**
 * @route   GET /api/v1/services
 * @desc    Get all services with optional filters
 * @access  Public
 */
router.route('/')
  .post(protect, authorize('student', 'freelancer'), createService)
  .get(getServices);

/**
 * @route   GET /api/v1/services/:id
 * @desc    Get service by ID
 * @access  Public
 */
/**
 * @route   PUT /api/v1/services/:id
 * @desc    Update a service listing
 * @access  Private (Student/Freelancer - Owner only)
 */
/**
 * @route   DELETE /api/v1/services/:id
 * @desc    Delete a service listing
 * @access  Private (Student/Freelancer - Owner only)
 */
router.route('/:id')
  .get(getServiceById)
  .put(protect, authorize('student', 'freelancer'), updateService)
  .delete(protect, authorize('student', 'freelancer'), deleteService);

/**
 * @route   GET /api/v1/services/freelancer/:id
 * @desc    Get all services by a specific freelancer
 * @access  Public
 */
router.get('/freelancer/:id', getFreelancerServices);

/**
 * @route   GET /api/v1/services/my-services
 * @desc    Get all services posted by current user
 * @access  Private (Student/Freelancer)
 */
router.get('/my-services', protect, authorize('student', 'freelancer'), getFreelancerServices);

module.exports = router;
