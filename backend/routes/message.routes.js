/**
 * Message Routes
 * @module routes/messages
 * @description Real-time messaging and conversation endpoints
 * @version 1.0.0
 */

const express = require('express');
const { sendMessage, getConversations, getMessages, markAsRead } = require('../controllers/messageController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All message routes require authentication
router.use(protect);

/**
 * @route   POST /api/v1/messages
 * @desc    Send a new message
 * @access  Private
 */
router.post('/', sendMessage);

/**
 * @route   GET /api/v1/messages/conversations
 * @desc    Get all conversations for current user
 * @access  Private
 */
router.get('/conversations', getConversations);

/**
 * @route   GET /api/v1/messages/:conversationId
 * @desc    Get all messages in a conversation
 * @access  Private
 */
router.get('/:conversationId', getMessages);

/**
 * @route   PUT /api/v1/messages/:conversationId/read
 * @desc    Mark all messages in conversation as read
 * @access  Private
 */
router.put('/:conversationId/read', markAsRead);

module.exports = router;
