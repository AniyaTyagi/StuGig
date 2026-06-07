const Invitation = require('../models/Invitation');
const Job = require('../models/Job');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');
const { createNotification } = require('../utils/notification');

// @route   POST /api/invitations
const createInvitation = catchAsync(async (req, res) => {
  const { jobId, freelancerId, message } = req.body;

  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  if (job.client.toString() !== req.user._id.toString()) {
    throw new AppError('Only job owner can send invitations', 403);
  }

  if (job.status !== 'open') {
    throw new AppError('Can only invite to open jobs', 400);
  }

  const freelancer = await User.findById(freelancerId);
  if (!freelancer || !['student', 'freelancer'].includes(freelancer.role)) {
    throw new AppError('Invalid freelancer', 404);
  }

  const existingInvitation = await Invitation.findOne({ job: jobId, freelancer: freelancerId });
  if (existingInvitation) {
    throw new AppError('Invitation already sent to this freelancer', 400);
  }

  const invitation = await Invitation.create({
    job: jobId,
    freelancer: freelancerId,
    client: req.user._id,
    message: message || `You've been invited to work on: ${job.title}`
  });

  await createNotification(
    freelancerId,
    'job_invitation',
    'New Job Invitation',
    `${req.user.firstName} invited you to work on "${job.title}"`,
    `/invitations/${invitation._id}`
  );

  const populatedInvitation = await Invitation.findById(invitation._id)
    .populate('job', 'title description budget category deadline')
    .populate('client', 'firstName lastName avatar companyName')
    .populate('freelancer', 'firstName lastName avatar');

  ApiResponse.success(res, populatedInvitation, 'Invitation sent successfully', 201);
});

// @route   GET /api/invitations
const getMyInvitations = catchAsync(async (req, res) => {
  const invitations = await Invitation.find({ 
    freelancer: req.user._id,
    status: { $in: ['pending', 'accepted'] }
  })
    .populate('job', 'title description budget category deadline status')
    .populate('client', 'firstName lastName avatar companyName')
    .sort('-createdAt');

  ApiResponse.success(res, invitations, 'Invitations fetched successfully');
});

// @route   GET /api/invitations/sent
const getSentInvitations = catchAsync(async (req, res) => {
  const invitations = await Invitation.find({ client: req.user._id })
    .populate('job', 'title description budget category')
    .populate('freelancer', 'firstName lastName avatar university')
    .sort('-createdAt');

  ApiResponse.success(res, invitations, 'Sent invitations fetched successfully');
});

// @route   PUT /api/invitations/:id/accept
const acceptInvitation = catchAsync(async (req, res) => {
  const invitation = await Invitation.findById(req.params.id)
    .populate('job', 'title client')
    .populate('client', 'firstName lastName');

  if (!invitation) {
    throw new AppError('Invitation not found', 404);
  }

  if (invitation.freelancer.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  if (invitation.status !== 'pending') {
    throw new AppError('Invitation already processed', 400);
  }

  if (new Date() > invitation.expiresAt) {
    invitation.status = 'expired';
    await invitation.save();
    throw new AppError('Invitation has expired', 400);
  }

  invitation.status = 'accepted';
  await invitation.save();

  await createNotification(
    invitation.client._id,
    'invitation_accepted',
    'Invitation Accepted',
    `${req.user.firstName} accepted your invitation for "${invitation.job.title}"`,
    `/jobs/${invitation.job._id}`
  );

  ApiResponse.success(res, invitation, 'Invitation accepted successfully');
});

// @route   PUT /api/invitations/:id/decline
const declineInvitation = catchAsync(async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);

  if (!invitation) {
    throw new AppError('Invitation not found', 404);
  }

  if (invitation.freelancer.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  if (invitation.status !== 'pending') {
    throw new AppError('Invitation already processed', 400);
  }

  invitation.status = 'declined';
  await invitation.save();

  ApiResponse.success(res, invitation, 'Invitation declined');
});

// @route   DELETE /api/invitations/:id
const deleteInvitation = catchAsync(async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);

  if (!invitation) {
    throw new AppError('Invitation not found', 404);
  }

  if (invitation.client.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  await invitation.deleteOne();
  ApiResponse.success(res, null, 'Invitation deleted successfully');
});

module.exports = {
  createInvitation,
  getMyInvitations,
  getSentInvitations,
  acceptInvitation,
  declineInvitation,
  deleteInvitation
};
