

const Activity = require('../models/ActivityM');
const mongoose = require('mongoose');

// Helper to calculate total and category-wise emissions
const calculateAnalytics = (activities) => {
  const total = activities.reduce((sum, act) => sum + (act.co2Emissions || 0), 0);

  const categories = {};
  activities.forEach(act => {
    const cat = act.type;
    if (!categories[cat]) categories[cat] = 0;
    categories[cat] += act.co2Emissions || 0;
  });

  return { total, categories };
};

// GET /api/analytics/:period
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id; // Auth middleware should add req.user
    const period = req.params.period; // daily, weekly, monthly

    let startDate = new Date();

    switch (period) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate.setDate(startDate.getDate() - startDate.getDay()); // start of week (Sunday)
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        return res.status(400).json({ message: 'Invalid period' });
    }

    // Fetch activities for user from startDate
    const activities = await Activity.find({
      userId: mongoose.Types.ObjectId(userId),
      date: { $gte: startDate }
    });

    const analytics = calculateAnalytics(activities);

    // Prepare response for charts
    const response = {
      totalEmissions: analytics.total,
      categoryEmissions: analytics.categories,
      activities: activities.map(a => ({
        date: a.date,
        type: a.type,
        co2Emissions: a.co2Emissions,
        data: a.data
      }))
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAnalytics };