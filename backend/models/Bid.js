const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  deliveryTime: { type: Number, required: true, min: 1 },
  proposal: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'], 
    default: 'pending',
    index: true
  },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

bidSchema.index({ job: 1, freelancer: 1 }, { unique: true });
bidSchema.index({ status: 1, createdAt: -1 });
bidSchema.index({ freelancer: 1, status: 1 });

module.exports = mongoose.model('Bid', bidSchema);
