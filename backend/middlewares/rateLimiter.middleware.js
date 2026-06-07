const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Higher limit in dev
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 50 : 5, // Higher limit in dev
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again after 15 minutes'
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'development' ? 100 : 20, // Higher limit in dev
  message: 'Too many file uploads, please try again later'
});

module.exports = {
  rateLimiter,
  authLimiter,
  uploadLimiter
};
