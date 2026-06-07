const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  budget: { type: Number, required: true, min: 0 },
  jobType: { type: String, enum: ['project', 'internship'], default: 'project', index: true },
  deadline: { type: Date, required: true },
  skills: [{ type: String }],
  attachments: [{ name: String, url: String }],
  status: { 
    type: String, 
    enum: ['open', 'awarded', 'in_progress', 'completed', 'cancelled'], 
    default: 'open',
    index: true
  },
  bidsCount: { type: Number, default: 0 },
  acceptedBid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' },
  assignedFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

jobSchema.index({ category: 1, budget: 1, status: 1 });
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ client: 1, status: 1 });
jobSchema.index({ assignedFreelancer: 1, status: 1 });
jobSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
