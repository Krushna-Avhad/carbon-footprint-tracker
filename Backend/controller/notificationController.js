const Notification = require('../models/NotificationM');

// Send a new notification
const sendNotification = async (userId, message) => {
  const notification = new Notification({ userId, message });
  await notification.save();
  return notification;
};

// Get notifications for a user
const getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.find({ userId }).sort({ date: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const id = req.params.id;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendNotification, getNotifications, markAsRead };