const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  subcategory: { type: String },
  price: { type: Number, required: true, min: 0 },
  deliveryTime: { type: Number, required: true, min: 1 },
  images: [{ type: String }],
  tags: [{ type: String }],
  features: [{ type: String }],
  requirements: { type: String, default: '' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  ordersCompleted: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

serviceSchema.index({ category: 1, price: 1, rating: -1 });
serviceSchema.index({ title: 'text', description: 'text', tags: 'text' });
serviceSchema.index({ freelancer: 1, isActive: 1 });
serviceSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Service', serviceSchema);
