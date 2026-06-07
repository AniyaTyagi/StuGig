const Payment = require('../models/Payment');
const Job = require('../models/Job');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const PLATFORM_COMMISSION = parseFloat(process.env.PLATFORM_COMMISSION) || 15;

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxxxx',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret'
});

// Generate unique transaction ID
const generateTransactionId = () => {
  return `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Create payment and hold in escrow
exports.createPayment = async (req, res) => {
  try {
    const { jobId, amount, paymentMethod } = req.body;

    const job = await Job.findById(jobId).populate('client assignedFreelancer');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.client._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (job.status !== 'awarded') {
      return res.status(400).json({ message: 'Job must be awarded before payment' });
    }

    // Check if client has sufficient balance
    const client = await User.findById(req.user._id);
    if (client.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const platformFee = (amount * PLATFORM_COMMISSION) / 100;
    const freelancerAmount = amount - platformFee;

    const payment = await Payment.create({
      job: jobId,
      payer: req.user._id,
      payee: job.assignedFreelancer._id,
      amount,
      platformFee,
      freelancerAmount,
      paymentMethod,
      transactionId: generateTransactionId(),
      status: 'held'
    });

    // Deduct from client balance
    client.balance -= amount;
    await client.save();

    job.payment = payment._id;
    job.status = 'in_progress';
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Payment held in escrow',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Release payment to freelancer
exports.releasePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId).populate('job payer payee');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.payer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only payer can release payment' });
    }

    if (payment.status !== 'held') {
      return res.status(400).json({ message: 'Payment not in held status' });
    }

    // Transfer to freelancer
    const freelancer = await User.findById(payment.payee._id);
    freelancer.balance += payment.freelancerAmount;
    freelancer.earnings += payment.freelancerAmount;
    freelancer.completedJobs = (freelancer.completedJobs || 0) + 1; // Track for AI
    await freelancer.save();

    // Update client spending
    const client = await User.findById(payment.payer._id);
    client.spending += payment.amount;
    await client.save();

    payment.status = 'released';
    payment.releasedAt = Date.now();
    await payment.save();

    const job = await Job.findById(payment.job._id);
    job.status = 'completed';
    await job.save();

    res.json({
      success: true,
      message: 'Payment released to freelancer',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refund payment to client
exports.refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findById(paymentId).populate('job payer payee');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Admin or payer can refund
    if (req.user.role !== 'admin' && payment.payer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to refund' });
    }

    if (payment.status !== 'held') {
      return res.status(400).json({ message: 'Can only refund held payments' });
    }

    // Return full amount to client
    const client = await User.findById(payment.payer._id);
    client.balance += payment.amount;
    await client.save();

    payment.status = 'refunded';
    payment.refundedAt = Date.now();
    await payment.save();

    const job = await Job.findById(payment.job._id);
    job.status = 'cancelled';
    await job.save();

    res.json({
      success: true,
      message: 'Payment refunded to client',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment details
exports.getPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate('job', 'title')
      .populate('payer', 'firstName lastName email')
      .populate('payee', 'firstName lastName email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check authorization
    if (
      payment.payer._id.toString() !== req.user._id.toString() &&
      payment.payee._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user payments
exports.getUserPayments = async (req, res) => {
  try {
    const { type } = req.query; // 'sent' or 'received'
    const filter = type === 'sent' 
      ? { payer: req.user._id } 
      : type === 'received'
      ? { payee: req.user._id }
      : { $or: [{ payer: req.user._id }, { payee: req.user._id }] };

    const payments = await Payment.find(filter)
      .populate('job', 'title')
      .populate('payer', 'firstName lastName')
      .populate('payee', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Razorpay order for adding funds
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in paise/cents

    const options = {
      amount: amount,
      currency: 'INR', // Change to USD if needed
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add funds to wallet
exports.addFunds = async (req, res) => {
  try {
    const { amount, paymentMethod, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Verify Razorpay signature if using Razorpay
    if (paymentMethod === 'razorpay' && razorpayPaymentId) {
      const sign = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSign = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest('hex');

      if (razorpaySignature !== expectedSign) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
    }

    const user = await User.findById(req.user._id);
    user.balance += amount;
    await user.save();

    res.json({
      success: true,
      message: `$${amount} added to wallet`,
      balance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Withdraw funds
exports.withdrawFunds = async (req, res) => {
  try {
    const { amount, withdrawMethod } = req.body;

    const user = await User.findById(req.user._id);
    
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance -= amount;
    await user.save();

    res.json({
      success: true,
      message: `Withdrawal of ${amount} initiated`,
      balance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get wallet balance
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('balance earnings spending');
    res.json({ success: true, wallet: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
