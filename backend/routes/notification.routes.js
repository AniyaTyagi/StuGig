/**
 * Notification Routes
 * @module routes/notifications
 * @description User notification management endpoints
 * @version 1.0.0
 */

const express = require('express');
const { getNotifications, markAsRead, markAllAsRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All notification routes require authentication
router.use(protect);

/**
 * @route   GET /api/v1/notifications
 * @desc    Get all notifications for current user
 * @access  Private
 */
router.get('/', getNotifications);

/**
 * @route   PUT /api/v1/notifications/:notificationId/read
 * @desc    Mark a notification as read
 * @access  Private
 */
router.put('/:notificationId/read', markAsRead);

/**
 * @route   PUT /api/v1/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read-all', markAllAsRead);

/**
 * @route   DELETE /api/v1/notifications/:notificationId
 * @desc    Delete a notification
 * @access  Private
 */
router.delete('/:notificationId', deleteNotification);

module.exports = router;
