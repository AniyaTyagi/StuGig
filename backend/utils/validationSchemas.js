const { body, param, query } = require('express-validator');

const authValidation = {
  register: [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['student', 'recruiter', 'startup', 'admin']).withMessage('Invalid role'),
  ],
  login: [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  updatePassword: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  forgotPassword: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  ],
  resetPassword: [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
};

const jobValidation = {
  create: [
    body('title').trim().notEmpty().withMessage('Job title is required'),
    body('description').trim().notEmpty().withMessage('Job description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('budget').isNumeric().withMessage('Budget must be a number'),
    body('deadline').optional().isISO8601().withMessage('Invalid deadline format'),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid job ID'),
    body('title').optional().trim().notEmpty().withMessage('Job title cannot be empty'),
    body('budget').optional().isNumeric().withMessage('Budget must be a number'),
  ],
};

const bidValidation = {
  create: [
    body('job').isMongoId().withMessage('Valid job ID is required'),
    body('amount').isNumeric().withMessage('Bid amount must be a number'),
    body('deliveryTime').isNumeric().withMessage('Delivery time must be a number'),
    body('proposal').trim().notEmpty().withMessage('Proposal is required'),
  ],
};

const serviceValidation = {
  create: [
    body('title').trim().notEmpty().withMessage('Service title is required'),
    body('description').trim().notEmpty().withMessage('Service description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('deliveryTime').isNumeric().withMessage('Delivery time must be a number'),
  ],
};

const reviewValidation = {
  create: [
    body('job').isMongoId().withMessage('Valid job ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim(),
  ],
};

const messageValidation = {
  send: [
    body('conversation').isMongoId().withMessage('Valid conversation ID is required'),
    body('content').trim().notEmpty().withMessage('Message content is required'),
  ],
};

module.exports = {
  authValidation,
  jobValidation,
  bidValidation,
  serviceValidation,
  reviewValidation,
  messageValidation,
};
