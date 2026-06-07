const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', index: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', index: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

reviewSchema.index({ reviewee: 1, rating: -1 });
reviewSchema.index({ job: 1, reviewer: 1 }, { unique: true, sparse: true });
reviewSchema.index({ reviewer: 1 });

module.exports = mongoose.model('Review', reviewSchema);
