const BaseService = require('./BaseService');
const User = require('../models/User');
const AppError = require('../utils/AppError');

class UserService extends BaseService {
  constructor() {
    super(User);
  }

  async getUserById(userId) {
    return await this.findById(userId);
  }

  async getUserByEmail(email) {
    return await this.findOne({ email }).select('+password');
  }

  async updateProfile(userId, updateData) {
    const allowedFields = [
      'firstName', 'lastName', 'bio', 'skills', 'hourlyRate', 
      'location', 'university', 'portfolio', 'avatar', 'resume',
      'experience', 'companyName', 'companyLogo', 'industry', 
      'teamSize', 'fundingStage', 'hiringStatus'
    ];

    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    return await this.update(userId, filteredData);
  }

  async searchUsers(filters, options) {
    const { role, skills, minRate, maxRate, location, university, search } = filters;
    
    let query = { isDeleted: false, isActive: true };
    
    if (role) query.role = role;
    if (location) query.location = new RegExp(location, 'i');
    if (university) query.university = new RegExp(university, 'i');
    if (skills && skills.length > 0) {
      query.skills = { $in: Array.isArray(skills) ? skills : [skills] };
    }
    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = parseFloat(minRate);
      if (maxRate) query.hourlyRate.$lte = parseFloat(maxRate);
    }
    if (search) query.$text = { $search: search };

    return await this.findAll(query, {
      ...options,
      sort: '-rating -reviewCount'
    });
  }

  async updateLastActive(userId) {
    await this.model.findByIdAndUpdate(userId, { lastActive: Date.now() });
  }

  async incrementEarnings(userId, amount) {
    await this.model.findByIdAndUpdate(userId, {
      $inc: { earnings: amount }
    });
  }

  async incrementSpending(userId, amount) {
    await this.model.findByIdAndUpdate(userId, {
      $inc: { spending: amount }
    });
  }

  async updateRating(userId, newRating) {
    const user = await this.findById(userId);
    const totalReviews = user.reviewCount;
    const currentRating = user.rating;
    
    const updatedRating = ((currentRating * totalReviews) + newRating) / (totalReviews + 1);
    
    user.rating = updatedRating;
    user.reviewCount = totalReviews + 1;
    await user.save();
    
    return user;
  }

  async deactivateAccount(userId) {
    return await this.update(userId, { isActive: false });
  }

  async deleteAccount(userId) {
    return await this.softDelete(userId);
  }
}

module.exports = new UserService();
