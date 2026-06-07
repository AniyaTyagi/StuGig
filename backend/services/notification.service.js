const Notification = require('../models/Notification');

class NotificationService {
  setIO(io) {
    this.io = io;
  }

  async create(userId, type, title, message, relatedId = null) {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      link: relatedId
    });

    // Emit real-time notification via socket
    if (this.io) {
      this.io.to(userId.toString()).emit('notification', {
        _id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        link: notification.link,
        isRead: false,
        createdAt: notification.createdAt
      });
    }

    return notification;
  }

  async notifyNewBid(clientId, jobTitle, freelancerName, jobId) {
    return this.create(
      clientId,
      'bid',
      'New Proposal Received',
      `${freelancerName} submitted a proposal on "${jobTitle}"`,
      jobId
    );
  }

  async notifyBidAccepted(freelancerId, jobTitle, jobId) {
    return this.create(
      freelancerId,
      'bid_accepted',
      'Proposal Accepted!',
      `Congratulations! Your proposal for "${jobTitle}" has been accepted`,
      jobId
    );
  }

  async notifyBidRejected(freelancerId, jobTitle, jobId) {
    return this.create(
      freelancerId,
      'bid_rejected',
      'Proposal Declined',
      `Your proposal for "${jobTitle}" was not accepted`,
      jobId
    );
  }

  async notifyNewMessage(userId, senderName, conversationId) {
    return this.create(
      userId,
      'message',
      'New Message',
      `You have a new message from ${senderName}`,
      conversationId
    );
  }

  async notifyPaymentReleased(freelancerId, amount, jobTitle, jobId) {
    return this.create(
      freelancerId,
      'payment',
      'Payment Released',
      `Payment of $${amount} has been released for "${jobTitle}"`,
      jobId
    );
  }

  async notifyPaymentCreated(freelancerId, amount, jobTitle, jobId) {
    return this.create(
      freelancerId,
      'payment',
      'Payment Received',
      `Payment of $${amount} is held in escrow for "${jobTitle}"`,
      jobId
    );
  }

  async notifyNewReview(userId, rating, reviewerName, jobId) {
    return this.create(
      userId,
      'review',
      'New Review Received',
      `${reviewerName} left you a ${rating}-star review`,
      jobId
    );
  }

  async notifyJobAssigned(freelancerId, jobTitle, jobId) {
    return this.create(
      freelancerId,
      'job',
      'Job Assigned',
      `You have been assigned to work on "${jobTitle}"`,
      jobId
    );
  }
}

module.exports = new NotificationService();
