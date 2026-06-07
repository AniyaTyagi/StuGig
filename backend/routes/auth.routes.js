/**
 * Authentication Routes
 * @module routes/auth
 * @description User authentication and profile management
 * @version 1.0.0
 */

const express = require('express');
const { register, login, getMe, updatePassword, refreshToken, verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { authValidation } = require('../utils/validationSchemas');

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authValidation.register, validate, register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 */
router.post('/login', authValidation.login, validate, login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   PUT /api/v1/auth/password
 * @desc    Update user password
 * @access  Private
 */
router.put('/password', protect, authValidation.updatePassword, validate, updatePassword);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh JWT token
 * @access  Public
 */
router.post('/refresh', refreshToken);

/**
 * @route   GET /api/v1/auth/verify-email
 * @desc    Verify user email address
 * @access  Public
 */
router.get('/verify-email', verifyEmail);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password', authValidation.forgotPassword, validate, forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', authValidation.resetPassword, validate, resetPassword);

module.exports = router;
