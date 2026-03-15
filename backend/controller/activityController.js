const Activity = require('../models/ActivityM');
const calculateCO2 = require('../utils/calculateCO2');
const { checkAchievements } = require('./achievementController');
const { sendNotification } = require('./notificationController');

const createActivity = async (req, res) => {
  try {
    const { type, data, date } = req.body;
    const co2 = calculateCO2(type, data);

    const activity = await Activity.create({
      userId: req.user.id,
      type,
      data,
      co2Emissions: co2,
      // Use provided date (for backdating) or fallback to now
      date: date ? new Date(date) : new Date(),
    });

    // Auto-check achievements after logging
    try {
      const newBadges = await checkAchievements(req.user.id);
      for (const badge of newBadges) {
        await sendNotification(req.user.id, `🏆 Achievement unlocked: ${badge.name}!`);
      }
    } catch (_) {}

    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getActivities = async (req, res) => {
  try {
    const { type, range, search } = req.query;
    const filter = { userId: req.user.id };

    // Filter by type
    if (type && type !== 'All') {
      filter.type = type.toLowerCase();
    }

    // Filter by date range
    if (range && range !== 'all') {
      const now = new Date();
      let startDate = new Date();
      if (range === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (range === 'week') {
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
      } else if (range === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      filter.date = { $gte: startDate };
    }

    let activities = await Activity.find(filter).sort({ date: -1 });

    // Search filter (applied in memory — searches over serialised data fields)
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      activities = activities.filter(a => {
        const dataStr = JSON.stringify(a.data || {}).toLowerCase();
        return (
          a.type.toLowerCase().includes(q) ||
          dataStr.includes(q) ||
          String(a.co2Emissions).includes(q)
        );
      });
    }

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { type, data, date } = req.body;
    const co2 = calculateCO2(type, data);

    const updateFields = { type, data, co2Emissions: co2 };
    if (date) updateFields.date = new Date(date);

    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateFields,
      { new: true }
    );
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createActivity, getActivities, deleteActivity, updateActivity };
