const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

exports.getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  ApiResponse.success(res, { user }, 'Profile fetched');
});

exports.updateProfile = catchAsync(async (req, res) => {
  const allowed = ['firstName', 'lastName', 'bio', 'skills', 'university', 'portfolio', 'hourlyRate', 'location'];
  const updates = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
  ApiResponse.success(res, { user }, 'Profile updated');
});

exports.getFreelancerProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -email');
  if (!user) return res.status(404).json({ message: 'User not found' });
  ApiResponse.success(res, { user }, 'Profile fetched');
});

exports.getClientProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -email');
  if (!user) return res.status(404).json({ message: 'User not found' });
  ApiResponse.success(res, { user }, 'Profile fetched');
});

exports.updateAvatar = catchAsync(async (req, res) => {
  const avatar = req.file ? `/uploads/${req.file.filename}` : req.body.avatar;
  const user = await User.findByIdAndUpdate(req.user.id, { avatar }, { new: true }).select('-password');
  ApiResponse.success(res, { user }, 'Avatar updated');
});

exports.addPortfolioItem = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { portfolio: req.body } },
    { new: true }
  ).select('-password');
  ApiResponse.success(res, { user }, 'Portfolio item added');
});

exports.removePortfolioItem = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { portfolio: { _id: req.params.itemId } } },
    { new: true }
  ).select('-password');
  ApiResponse.success(res, { user }, 'Portfolio item removed');
});

exports.getProfileCompletion = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  const fields = ['firstName', 'lastName', 'bio', 'skills', 'university', 'avatar'];
  const filled = fields.filter(f => user[f] && (Array.isArray(user[f]) ? user[f].length > 0 : true)).length;
  const completion = Math.round((filled / fields.length) * 100);
  ApiResponse.success(res, { completion }, 'Profile completion fetched');
});

exports.uploadAndParseResume = catchAsync(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const resumeUrl = `/uploads/${req.file.filename}`;
  await User.findByIdAndUpdate(req.user.id, { resume: resumeUrl });
  ApiResponse.success(res, { resumeUrl }, 'Resume uploaded');
});

exports.getStudents = catchAsync(async (req, res) => {
  const users = await User.find({ role: 'student' }).select('-password').limit(50);
  ApiResponse.success(res, { users }, 'Students fetched');
});

exports.getBusinesses = catchAsync(async (req, res) => {
  const users = await User.find({ role: { $in: ['startup', 'recruiter'] } }).select('-password').limit(50);
  ApiResponse.success(res, { users }, 'Businesses fetched');
});
