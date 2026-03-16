const Notification = require('../models/NotificationM');

// ─── Internal helper — called from other controllers ──────────────────────────
// Prevents duplicate notifications of the same type within a time window
const sendNotification = async (userId, message, type = 'general', dedupeHours = 0) => {
  try {
    // If dedupeHours > 0, check if same message was already sent recently
    if (dedupeHours > 0) {
      const since = new Date(Date.now() - dedupeHours * 60 * 60 * 1000);
      const exists = await Notification.findOne({ userId, message, date: { $gte: since } });
      if (exists) return null; // already sent recently — skip
    }

    const notification = new Notification({ userId, message, type });
    await notification.save();
    return notification;
  } catch (err) {
    console.error('sendNotification error:', err.message);
    return null;
  }
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
