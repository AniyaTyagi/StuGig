const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { 
    type: String, 
    enum: ['bid_received', 'bid_accepted', 'bid_rejected', 'message', 'payment', 'review', 'job_completed', 'job_invitation', 'invitation_accepted'],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  isRead: { type: Boolean, default: false, index: true },
  readAt: { type: Date }
}, { timestamps: true });

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
