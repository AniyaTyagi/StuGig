/**
 * User Routes
 * @module routes/users
 * @description User profile and portfolio management
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getFreelancerProfile,
  getClientProfile,
  updateAvatar,
  addPortfolioItem,
  removePortfolioItem,
  getProfileCompletion,
  uploadAndParseResume,
  getStudents,
  getBusinesses
} = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', protect, getProfile);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', protect, updateProfile);

/**
 * @route   POST /api/v1/users/avatar
 * @desc    Update user avatar
 * @access  Private
 */
router.post('/avatar', protect, updateAvatar);

/**
 * @route   GET /api/v1/users/completion
 * @desc    Get profile completion percentage
 * @access  Private
 */
router.get('/completion', protect, getProfileCompletion);

/**
 * @route   POST /api/v1/users/resume
 * @desc    Upload and parse resume
 * @access  Private
 */
router.post('/resume', protect, upload.single('resume'), uploadAndParseResume);

/**
 * @route   POST /api/v1/users/portfolio
 * @desc    Add portfolio item
 * @access  Private
 */
router.post('/portfolio', protect, addPortfolioItem);

/**
 * @route   DELETE /api/v1/users/portfolio/:itemId
 * @desc    Remove portfolio item
 * @access  Private
 */
router.delete('/portfolio/:itemId', protect, removePortfolioItem);

/**
 * @route   GET /api/v1/users/students
 * @desc    Get all student/freelancer profiles
 * @access  Public
 */
router.get('/students', getStudents);

/**
 * @route   GET /api/v1/users/businesses
 * @desc    Get all business/client profiles
 * @access  Public
 */
router.get('/businesses', getBusinesses);

/**
 * @route   GET /api/v1/users/freelancer/:id
 * @desc    Get freelancer profile by ID
 * @access  Public
 */
router.get('/freelancer/:id', getFreelancerProfile);

/**
 * @route   GET /api/v1/users/student/:id
 * @desc    Get student profile by ID (alias)
 * @access  Public
 */
router.get('/student/:id', getFreelancerProfile);

/**
 * @route   GET /api/v1/users/client/:id
 * @desc    Get client profile by ID
 * @access  Public
 */
router.get('/client/:id', getClientProfile);

/**
 * @route   GET /api/v1/users/business/:id
 * @desc    Get business profile by ID (alias)
 * @access  Public
 */
router.get('/business/:id', getClientProfile);

module.exports = router;
