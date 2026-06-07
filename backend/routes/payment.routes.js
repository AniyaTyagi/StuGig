/**
 * Payment Routes
 * @module routes/payments
 * @description Escrow payment system and wallet management
 * @version 1.0.0
 */

const express = require('express');
const { body, param } = require('express-validator');
const {
  createPayment,
  releasePayment,
  refundPayment,
  getPayment,
  getUserPayments,
  addFunds,
  withdrawFunds,
  getBalance,
  createRazorpayOrder
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/v1/payments/balance
 * @desc    Get current user wallet balance
 * @access  Private
 */
router.get('/balance', getBalance);

/**
 * @route   POST /api/v1/payments/create-razorpay-order
 * @desc    Create Razorpay order for adding funds
 * @access  Private
 */
router.post('/create-razorpay-order', [
  body('amount').isInt({ min: 1000 }).withMessage('Amount must be at least 1000 paise (10 USD)'),
  validate
], createRazorpayOrder);

/**
 * @route   POST /api/v1/payments/add-funds
 * @desc    Add funds to user wallet
 * @access  Private
 */
router.post('/add-funds', [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
  body('paymentMethod').isIn(['wallet', 'bank_transfer', 'cash']).optional(),
  validate
], addFunds);

/**
 * @route   POST /api/v1/payments/withdraw
 * @desc    Withdraw funds from wallet
 * @access  Private
 */
router.post('/withdraw', [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
  body('withdrawMethod').isString().notEmpty().withMessage('Withdrawal method required'),
  validate
], withdrawFunds);

/**
 * @route   POST /api/v1/payments/create
 * @desc    Create escrow payment for a job
 * @access  Private
 */
router.post('/create', [
  body('jobId').isMongoId().withMessage('Valid job ID required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
  body('paymentMethod').isIn(['wallet', 'bank_transfer', 'cash']).optional(),
  validate
], createPayment);

/**
 * @route   POST /api/v1/payments/:paymentId/release
 * @desc    Release payment to freelancer
 * @access  Private
 */
router.post('/:paymentId/release', [
  param('paymentId').isMongoId().withMessage('Valid payment ID required'),
  validate
], releasePayment);

/**
 * @route   POST /api/v1/payments/:paymentId/refund
 * @desc    Refund payment to client
 * @access  Private
 */
router.post('/:paymentId/refund', [
  param('paymentId').isMongoId().withMessage('Valid payment ID required'),
  body('reason').isString().optional(),
  validate
], refundPayment);

/**
 * @route   GET /api/v1/payments
 * @desc    Get all payments for current user
 * @access  Private
 */
router.get('/', getUserPayments);

/**
 * @route   GET /api/v1/payments/:paymentId
 * @desc    Get payment details by ID
 * @access  Private
 */
router.get('/:paymentId', [
  param('paymentId').isMongoId().withMessage('Valid payment ID required'),
  validate
], getPayment);

module.exports = router;
