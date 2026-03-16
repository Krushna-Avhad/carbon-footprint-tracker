const Activity = require('../models/ActivityM');
const mongoose = require('mongoose');

const calculateAnalytics = (activities) => {
  const total = activities.reduce((sum, act) => sum + (act.co2Emissions || 0), 0);
  const categories = {};
  activities.forEach(act => {
    const cat = act.type;
    if (!categories[cat]) categories[cat] = 0;
    categories[cat] += act.co2Emissions || 0;
  });
  return { total: parseFloat(total.toFixed(3)), categories };
};

/**
 * Eco Score (0–100):
 * Based on monthly CO2 vs global average (~400 kg/month per person).
 * 400+ kg → score 0, 0 kg → score 100. Linear scale.
 * Bonus points for using green transport, plant-based food, recycling.
 */
const computeEcoScore = (monthlyTotal, activities) => {
  const BASE_MONTHLY = 400; // kg — global average
  let score = Math.max(0, Math.round(((BASE_MONTHLY - monthlyTotal) / BASE_MONTHLY) * 80));

  // Bonus: green transport (bus/train/bike)
  const greenTransport = activities.filter(a =>
    a.type === 'transport' &&
    ['bus', 'train', 'bike'].includes((a.data?.mode || '').toLowerCase())
  ).length;
  score += Math.min(10, greenTransport);

  // Bonus: plant-based meals
  const plantMeals = activities.filter(a =>
    a.type === 'food' &&
    ['veg', 'vegan', 'vegetarian'].includes((a.data?.meal || '').toLowerCase())
  ).length;
  score += Math.min(10, plantMeals);

  return Math.min(100, Math.max(0, score));
};

// GET /api/analytics/:period  (daily | weekly | monthly)
const getAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const period = req.params.period;

    let startDate = new Date();
    switch (period) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        break;
      default:
        return res.status(400).json({ message: 'Invalid period. Use daily | weekly | monthly' });
    }

    const activities = await Activity.find({ userId, date: { $gte: startDate } });
    const analytics  = calculateAnalytics(activities);

    res.json({
      totalEmissions: analytics.total,
      categoryEmissions: analytics.categories,
      activities: activities.map(a => ({
        date: a.date, type: a.type, co2Emissions: a.co2Emissions, data: a.data,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/analytics/trend/monthly — last 6 months for line chart
const getMonthlyTrend = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now    = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const acts  = await Activity.find({ userId, date: { $gte: start, $lte: end } });
      const total = acts.reduce((s, a) => s + (a.co2Emissions || 0), 0);
      months.push({
        month:     start.toLocaleString('default', { month: 'short' }),
        emissions: parseFloat(total.toFixed(2)),
      });
    }

    res.json(months);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/analytics/summary — dashboard stats + eco score
const getSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now    = new Date();

    // Today
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const todayActs  = await Activity.find({ userId, date: { $gte: todayStart } });
    const todayTotal = todayActs.reduce((s, a) => s + (a.co2Emissions || 0), 0);

    // Yesterday
    const yStart = new Date(todayStart); yStart.setDate(yStart.getDate() - 1);
    const yActs  = await Activity.find({ userId, date: { $gte: yStart, $lt: todayStart } });
    const yTotal = yActs.reduce((s, a) => s + (a.co2Emissions || 0), 0);

    // This week
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7); weekStart.setHours(0, 0, 0, 0);
    const weekActs  = await Activity.find({ userId, date: { $gte: weekStart } });
    const weekTotal = weekActs.reduce((s, a) => s + (a.co2Emissions || 0), 0);

    // Last week
    const lwStart = new Date(weekStart); lwStart.setDate(lwStart.getDate() - 7);
    const lwActs  = await Activity.find({ userId, date: { $gte: lwStart, $lt: weekStart } });
    const lwTotal = lwActs.reduce((s, a) => s + (a.co2Emissions || 0), 0);

    // This month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthActs  = await Activity.find({ userId, date: { $gte: monthStart } });
    const monthTotal = monthActs.reduce((s, a) => s + (a.co2Emissions || 0), 0);

    // Last month
    const lmStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lmEnd   = new Date(now.getFullYear(), now.getMonth(), 1);
    const lmActs  = await Activity.find({ userId, date: { $gte: lmStart, $lt: lmEnd } });
    const lmTotal = lmActs.reduce((s, a) => s + (a.co2Emissions || 0), 0);

    // Categories (this month)
    const categories = {};
    monthActs.forEach(a => {
      if (!categories[a.type]) categories[a.type] = 0;
      categories[a.type] += a.co2Emissions || 0;
    });

    // Eco score (based on this month)
    const ecoScore = computeEcoScore(monthTotal, monthActs);

    const pct = (curr, prev) =>
      prev === 0 ? null : parseFloat((((curr - prev) / prev) * 100).toFixed(1));

    res.json({
      today:    { total: parseFloat(todayTotal.toFixed(2)), vsYesterday: pct(todayTotal, yTotal) },
      weekly:   { total: parseFloat(weekTotal.toFixed(2)),  vsLastWeek:  pct(weekTotal,  lwTotal) },
      monthly:  { total: parseFloat(monthTotal.toFixed(2)), vsLastMonth: pct(monthTotal, lmTotal) },
      categories,
      ecoScore,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/analytics/trend/:period — dynamic trend based on period
// daily   → 24 hours (grouped by hour)
// weekly  → 7 days (grouped by day)
// monthly → 6 months (grouped by month)
const getTrend = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const period = req.params.period;
    const now    = new Date();
    const points = [];

    if (period === 'daily') {
      // tzOffset is in minutes, sent by frontend (e.g. -330 for IST)
      // We negate it to convert UTC → local
      const tzOffset = parseInt(req.query.tz || '0');

      for (let i = 23; i >= 0; i--) {
        // Build start/end in UTC but accounting for local timezone
        const localNow = new Date(now.getTime() - tzOffset * 60000);
        const localStart = new Date(localNow);
        localStart.setUTCHours(localNow.getUTCHours() - i, 0, 0, 0);
        const localEnd = new Date(localStart);
        localEnd.setUTCMinutes(59, 59, 999);

        // Convert back to UTC for the DB query
        const utcStart = new Date(localStart.getTime() + tzOffset * 60000);
        const utcEnd   = new Date(localEnd.getTime()   + tzOffset * 60000);

        const acts  = await Activity.find({ userId, date: { $gte: utcStart, $lte: utcEnd } });
        const total = acts.reduce((s, a) => s + (a.co2Emissions || 0), 0);

        const hour = localStart.getUTCHours();
        const label = hour === 0 ? '12am'
          : hour < 12 ? `${hour}am`
          : hour === 12 ? '12pm'
          : `${hour - 12}pm`;

        points.push({ label, emissions: parseFloat(total.toFixed(2)) });
      }
    } else if (period === 'weekly') {
      const tzOffset = parseInt(req.query.tz || '0');
      const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      for (let i = 6; i >= 0; i--) {
        // Get local date by adjusting for timezone
        const localNow = new Date(now.getTime() - tzOffset * 60000);
        const localDay = new Date(localNow);
        localDay.setUTCDate(localNow.getUTCDate() - i);
        localDay.setUTCHours(0, 0, 0, 0);
        const localDayEnd = new Date(localDay);
        localDayEnd.setUTCHours(23, 59, 59, 999);

        // Convert to UTC for DB query
        const utcStart = new Date(localDay.getTime()    + tzOffset * 60000);
        const utcEnd   = new Date(localDayEnd.getTime() + tzOffset * 60000);

        const acts  = await Activity.find({ userId, date: { $gte: utcStart, $lte: utcEnd } });
        const total = acts.reduce((s, a) => s + (a.co2Emissions || 0), 0);

        points.push({
          label: i === 0 ? 'Today' : DAYS[localDay.getUTCDay()],
          emissions: parseFloat(total.toFixed(2)),
        });
      }
    } else {
      // Monthly — last 6 months (existing behaviour)
      for (let i = 5; i >= 0; i--) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
        const acts  = await Activity.find({ userId, date: { $gte: start, $lte: end } });
        const total = acts.reduce((s, a) => s + (a.co2Emissions || 0), 0);
        points.push({
          label: start.toLocaleString('default', { month: 'short' }),
          emissions: parseFloat(total.toFixed(2)),
        });
      }
    }

    res.json(points);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Re-export with getTrend added
module.exports = { getAnalytics, getMonthlyTrend, getSummary, getTrend };
