const Notification = require('../models/NotificationM');

// Internal helper — called from activity/achievement controllers
const sendNotification = async (userId, message) => {
  const notification = new Notification({ userId, message });
  await notification.save();
  return notification;
};

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/notifications/mark-all-read
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/notifications/:id
const deleteNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Notification dismissed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendNotification, getNotifications, markAsRead, markAllRead, deleteNotification };
