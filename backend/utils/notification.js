const notificationService = require('../services/notification.service');

const createNotification = async (userId, type, title, message, link = null, metadata = null) => {
  try {
    const notification = await notificationService.create(
      userId,
      type,
      title,
      message,
      link
    );
    return notification;
  } catch (error) {
    console.error('Notification creation error:', error);
    return null;
  }
};

module.exports = { createNotification };
