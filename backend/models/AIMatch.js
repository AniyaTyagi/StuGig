/**
 * AI Match Model
 * @description Stores AI matching history and feedback for continuous learning
 */

const mongoose = require('mongoose');

const aiMatchSchema = new mongoose.Schema({
  // Match Type
  matchType: {
    type: String,
    enum: ['job_to_freelancer', 'freelancer_to_job'],
    required: true
  },

  // Entities
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true
  },

  // AI Scoring
  compatibilityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
  // Detailed Score Breakdown
  scoreBreakdown: {
    skillMatch: { type: Number, default: 0 },
    experienceMatch: { type: Number, default: 0 },
    ratingMatch: { type: Number, default: 0 },
    budgetMatch: { type: Number, default: 0 },
    availabilityMatch: { type: Number, default: 0 },
    successRateMatch: { type: Number, default: 0 },
    categoryMatch: { type: Number, default: 0 },
    behaviorMatch: { type: Number, default: 0 }
  },

  // Learning Data
  wasRecommended: {
    type: Boolean,
    default: true
  },
  wasViewed: {
    type: Boolean,
    default: false
  },
  bidSubmitted: {
    type: Boolean,
    default: false
  },
  bidAccepted: {
    type: Boolean,
    default: false
  },
  jobCompleted: {
    type: Boolean,
    default: false
  },
  clientSatisfaction: {
    type: Number,
    min: 1,
    max: 5
  },

  // Feedback for Learning
  userFeedback: {
    helpful: { type: Boolean },
    reason: { type: String },
    timestamp: { type: Date }
  },

  // Metadata
  recommendedAt: {
    type: Date,
    default: Date.now
  },
  outcome: {
    type: String,
    enum: ['pending', 'viewed', 'bid_submitted', 'hired', 'completed', 'dismissed', 'expired'],
    default: 'pending'
  },

  // ML Features (for future enhancement)
  features: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
aiMatchSchema.index({ freelancer: 1, job: 1, createdAt: -1 });
aiMatchSchema.index({ compatibilityScore: -1 });
aiMatchSchema.index({ outcome: 1 });
aiMatchSchema.index({ wasRecommended: 1, bidAccepted: 1 });

// Calculate recommendation accuracy
aiMatchSchema.statics.getAccuracyMetrics = async function() {
  const totalRecommendations = await this.countDocuments({ wasRecommended: true });
  const viewedCount = await this.countDocuments({ wasViewed: true });
  const bidCount = await this.countDocuments({ bidSubmitted: true });
  const acceptedCount = await this.countDocuments({ bidAccepted: true });
  const completedCount = await this.countDocuments({ jobCompleted: true });

  return {
    totalRecommendations,
    viewRate: totalRecommendations ? (viewedCount / totalRecommendations * 100).toFixed(2) : 0,
    bidRate: totalRecommendations ? (bidCount / totalRecommendations * 100).toFixed(2) : 0,
    acceptanceRate: bidCount ? (acceptedCount / bidCount * 100).toFixed(2) : 0,
    completionRate: acceptedCount ? (completedCount / acceptedCount * 100).toFixed(2) : 0
  };
};

module.exports = mongoose.model('AIMatch', aiMatchSchema);
