const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'recruiter', 'startup', 'admin'], required: true },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  hourlyRate: { type: Number, min: 0 },
  location: { type: String, default: '' },
  university: { type: String, default: '' },
  portfolio: [{ title: String, url: String, image: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  spending: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 }, // Track for AI matching
  isVerified: { type: Boolean, default: false },
  
  // Student Specific Fields
  resume: { type: String, default: '' },
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],

  // Startup / Recruiter Specific Fields
  companyName: { type: String, default: '' },
  companyLogo: { type: String, default: '' },
  industry: { type: String, default: '' },
  teamSize: { type: Number, default: 0 },
  fundingStage: { type: String, default: '' },
  hiringStatus: { type: String, enum: ['hiring', 'not_hiring'], default: 'hiring' },
  
  // Verification and Security Fields
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, select: false },
  emailVerificationExpires: { type: Date, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  refreshToken: { type: String, select: false },
  
  isActive: { type: Boolean, default: true },
  lastActive: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.index({ skills: 1, role: 1 });
userSchema.index({ rating: -1 });
userSchema.index({ role: 1, rating: -1 });
userSchema.index({ university: 1 });
userSchema.index({ hourlyRate: 1 });
userSchema.index({ location: 1 });
userSchema.index(
  { firstName: 'text', bio: 'text', skills: 'text', university: 'text', companyName: 'text' },
  { weights: { firstName: 10, companyName: 8, skills: 5, university: 3, bio: 2 } }
);

module.exports = mongoose.model('User', userSchema);
