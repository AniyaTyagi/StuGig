const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');

class PaymentService {
  async createPaymentIntent(amount, clientId, jobId) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { clientId, jobId }
    });

    const payment = await Payment.create({
      client: clientId,
      job: jobId,
      amount,
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending'
    });

    return { clientSecret: paymentIntent.client_secret, payment };
  }

  async confirmPayment(paymentIntentId) {
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!payment) throw new Error('Payment not found');

    payment.status = 'held';
    await payment.save();

    return payment;
  }

  async releasePayment(paymentId, freelancerId) {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new Error('Payment not found');

    const platformCommission = payment.amount * 0.15;
    const freelancerAmount = payment.amount * 0.85;

    payment.freelancer = freelancerId;
    payment.platformCommission = platformCommission;
    payment.freelancerAmount = freelancerAmount;
    payment.status = 'released';
    payment.releasedAt = new Date();
    await payment.save();

    return payment;
  }

  async getPaymentHistory(userId, role) {
    const filter = role === 'freelancer' ? { freelancer: userId } : { client: userId };
    return await Payment.find(filter).populate('client freelancer job').sort({ createdAt: -1 });
  }
}

module.exports = new PaymentService();
