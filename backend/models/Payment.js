const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  payee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  platformFee: { type: Number, required: true, default: 0 },
  freelancerAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['wallet', 'bank_transfer', 'cash'], default: 'wallet' },
  transactionId: { type: String, unique: true, sparse: true },
  status: { 
    type: String, 
    enum: ['pending', 'held', 'released', 'refunded', 'failed'], 
    default: 'pending',
    index: true
  },
  releasedAt: { type: Date },
  refundedAt: { type: Date }
}, { timestamps: true });

paymentSchema.index({ payer: 1, status: 1 });
paymentSchema.index({ payee: 1, status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
