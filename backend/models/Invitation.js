const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  message: { type: String, trim: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined', 'expired'], 
    default: 'pending',
    index: true
  },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
}, { timestamps: true });

invitationSchema.index({ freelancer: 1, status: 1, createdAt: -1 });
invitationSchema.index({ job: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model('Invitation', invitationSchema);
