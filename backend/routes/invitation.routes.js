/**
 * Invitation Routes
 * @module routes/invitations
 * @description Job invitation system for direct hiring
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const {
  createInvitation,
  getMyInvitations,
  getSentInvitations,
  acceptInvitation,
  declineInvitation,
  deleteInvitation
} = require('../controllers/invitationController');
const { protect, authorize } = require('../middlewares/auth');

/**
 * @route   POST /api/v1/invitations
 * @desc    Create a job invitation
 * @access  Private (Recruiter/Startup/Client)
 */
router.post('/', protect, authorize('recruiter', 'startup', 'client'), createInvitation);

/**
 * @route   GET /api/v1/invitations
 * @desc    Get received invitations
 * @access  Private (Student/Freelancer)
 */
router.get('/', protect, authorize('student', 'freelancer'), getMyInvitations);

/**
 * @route   GET /api/v1/invitations/sent
 * @desc    Get sent invitations
 * @access  Private (Recruiter/Startup/Client)
 */
router.get('/sent', protect, authorize('recruiter', 'startup', 'client'), getSentInvitations);

/**
 * @route   PUT /api/v1/invitations/:id/accept
 * @desc    Accept an invitation
 * @access  Private (Student/Freelancer)
 */
router.put('/:id/accept', protect, authorize('student', 'freelancer'), acceptInvitation);

/**
 * @route   PUT /api/v1/invitations/:id/decline
 * @desc    Decline an invitation
 * @access  Private (Student/Freelancer)
 */
router.put('/:id/decline', protect, authorize('student', 'freelancer'), declineInvitation);

/**
 * @route   DELETE /api/v1/invitations/:id
 * @desc    Delete an invitation
 * @access  Private (Recruiter/Startup/Client)
 */
router.delete('/:id', protect, authorize('recruiter', 'startup', 'client'), deleteInvitation);

module.exports = router;
