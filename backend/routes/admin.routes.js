/**
 * Admin Routes
 * @module routes/admin
 * @description Admin-only routes for platform management
 * @version 1.0.0
 */

const express = require('express');
const { 
  getDashboardStats, 
  getAllUsers, 
  deleteUser, 
  verifyUser 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

/**
 * @route   GET /api/v1/admin/dashboard
 * @desc    Get platform statistics and analytics
 * @access  Admin
 */
router.get('/dashboard', getDashboardStats);

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users with filters
 * @access  Admin
 */
router.get('/users', getAllUsers);

/**
 * @route   DELETE /api/v1/admin/users/:userId
 * @desc    Soft delete a user
 * @access  Admin
 */
router.delete('/users/:userId', deleteUser);

/**
 * @route   PUT /api/v1/admin/users/:userId/verify
 * @desc    Verify a user account
 * @access  Admin
 */
router.put('/users/:userId/verify', verifyUser);

module.exports = router;
