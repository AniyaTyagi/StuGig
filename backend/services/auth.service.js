const User = require('../models/User');
const crypto = require('crypto');
const AppError = require('../utils/AppError');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const emailService = require('./emailService');

class AuthService {
  async register(userData) {
    const { firstName, email, password, role } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    const user = await User.create({ firstName, email, password, role });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    
    await user.save();

    // Send verification email (don't await, don't fail if it errors)
    emailService.sendVerificationEmail(user, verificationToken).catch(err => {
      console.log('Email service not available:', err.message);
    });

    return {
      token,
      refreshToken,
      user: this.sanitizeUser(user)
    };
  }

  async login(email, password) {
    // Normalize email to lowercase for case-insensitive lookup
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive || user.isDeleted) {
      throw new AppError('Account is inactive or deleted', 403);
    }

    user.lastActive = Date.now();
    
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    user.refreshToken = refreshToken;
    await user.save();

    return {
      token,
      refreshToken,
      user: this.sanitizeUser(user)
    };
  }

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      token: newToken,
      refreshToken: newRefreshToken
    };
  }

  async verifyEmail(token) {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return user;
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError('No user found with this email', 404);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    await emailService.sendPasswordResetEmail(user, resetToken);

    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = undefined;
    await user.save();

    return { message: 'Password reset successful' };
  }

  async updatePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    
    if (!(await user.comparePassword(currentPassword))) {
      throw new AppError('Current password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    return { token };
  }

  sanitizeUser(user) {
    return {
      _id: user._id,
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      university: user.university,
      balance: user.balance,
      earnings: user.earnings,
      spending: user.spending,
      isEmailVerified: user.isEmailVerified,
      rating: user.rating,
      reviewCount: user.reviewCount,
      companyName: user.companyName,
      companyLogo: user.companyLogo
    };
  }
}

module.exports = new AuthService();
