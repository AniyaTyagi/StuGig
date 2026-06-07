const authService = require('../services/auth.service');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

exports.register = catchAsync(async (req, res) => {
  console.log('📝 Registration request body:', req.body);
  const result = await authService.register(req.body);
  ApiResponse.success(res, result, 'Registration successful', 201);
});

exports.login = catchAsync(async (req, res) => {
  console.log('🔐 Login request body:', req.body);
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  ApiResponse.success(res, result, 'Login successful');
});

exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  ApiResponse.success(res, { user }, 'User profile fetched successfully');
});

exports.updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.updatePassword(req.user.id, currentPassword, newPassword);
  ApiResponse.success(res, result, 'Password updated successfully');
});

exports.refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshAccessToken(refreshToken);
  ApiResponse.success(res, result, 'Token refreshed successfully');
});

exports.verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;
  await authService.verifyEmail(token);
  ApiResponse.success(res, null, 'Email verified successfully');
});

exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  ApiResponse.success(res, result, result.message);
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;
  const result = await authService.resetPassword(token, password);
  ApiResponse.success(res, result, result.message);
});
