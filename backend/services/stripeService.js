const stripe = require('../config/stripe');

class StripeService {
  async createPaymentIntent(amount, metadata = {}) {
    return await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata
    });
  }

  async createCustomer(email, name) {
    return await stripe.customers.create({
      email,
      name
    });
  }

  async createTransfer(amount, destination) {
    return await stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      destination
    });
  }

  async refundPayment(paymentIntentId) {
    return await stripe.refunds.create({
      payment_intent: paymentIntentId
    });
  }
}

module.exports = new StripeService();
