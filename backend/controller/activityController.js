const Activity     = require('../models/ActivityM');
const Goal         = require('../models/GoalM');
const calculateCO2 = require('../utils/calculateCO2');
const { checkAchievements }  = require('./achievementController');
const { sendNotification }   = require('./notificationController');
const mongoose = require('mongoose');

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION ENGINE — runs after every activity is logged
// Checks all 6 notification types and fires relevant ones
// ─────────────────────────────────────────────────────────────────────────────
const runNotificationEngine = async (userId, newActivity) => {
  try {
    const uid  = new mongoose.Types.ObjectId(userId);
    const now  = new Date();

    // ── 1. GOAL PROGRESS ALERTS ─────────────────────────────────────────────
    // Check all active goals after every log
    const activeGoals = await Goal.find({ userId, achieved: false });

    for (const goal of activeGoals) {
      if (new Date(goal.endDate) < now) continue; // skip expired

      const filter = {
        userId: uid,
        date: { $gte: goal.startDate, $lte: goal.endDate },
      };
      if (goal.category !== 'overall') filter.type = goal.category;

      const acts           = await Activity.find(filter);
      const totalEmissions = acts.reduce((s, a) => s + (a.co2Emissions || 0), 0);
      const pct            = (totalEmissions / goal.targetKgCO2) * 100;
      const catLabel       = goal.category === 'overall' ? '' : ` ${goal.category}`;
      const daysLeft       = Math.ceil((new Date(goal.endDate) - now) / (1000 * 60 * 60 * 24));

      if (pct >= 100) {
        // Exceeded goal
        const over = parseFloat((totalEmissions - goal.targetKgCO2).toFixed(2));
        await sendNotification(
          userId,
          `🔴 You have exceeded your${catLabel} goal "${goal.name}" by ${over} kg CO₂!`,
          'goal',
          24 // don't repeat within 24 hours
        );
      } else if (pct >= 90) {
        await sendNotification(
          userId,
          `⚠️ You have used 90% of your${catLabel} goal "${goal.name}". ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left.`,
          'goal',
          24
        );
      } else if (pct >= 75) {
        await sendNotification(
          userId,
          `📊 You are at 75% of your${catLabel} goal "${goal.name}". Stay on track!`,
          'goal',
          48
        );
      }

      // Goal deadline approaching (3 days left)
      // ── 6. DEADLINE APPROACHING ───────────────────────────────────────────
      if (daysLeft <= 3 && daysLeft > 0 && pct < 100) {
        await sendNotification(
          userId,
          `⏳ Your goal "${goal.name}" deadline is in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}! You are at ${pct.toFixed(0)}%.`,
          'deadline',
          24
        );
      }
    }

    // ── 2. WEEKLY SUMMARY ───────────────────────────────────────────────────
    // Send if this is the first activity logged this week (Mon–Sun)
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Sunday
    weekStart.setHours(0, 0, 0, 0);

    const actsThisWeek = await Activity.find({ userId: uid, date: { $gte: weekStart } });

    if (actsThisWeek.length === 1) {
      // This is the very first log of this week — send last week's summary
      const lastWeekStart = new Date(weekStart);
      lastWeekStart.setDate(weekStart.getDate() - 7);
      const lastWeekEnd = new Date(weekStart);

      const lastWeekActs  = await Activity.find({ userId: uid, date: { $gte: lastWeekStart, $lt: lastWeekEnd } });
      const lastWeekTotal = lastWeekActs.reduce((s, a) => s + (a.co2Emissions || 0), 0);

      if (lastWeekTotal > 0) {
        // Compare to the week before that
        const prevWeekStart = new Date(lastWeekStart);
        prevWeekStart.setDate(lastWeekStart.getDate() - 7);
        const prevWeekActs  = await Activity.find({ userId: uid, date: { $gte: prevWeekStart, $lt: lastWeekStart } });
        const prevWeekTotal = prevWeekActs.reduce((s, a) => s + (a.co2Emissions || 0), 0);

        let comparison = '';
        if (prevWeekTotal > 0) {
          const diff = parseFloat((((lastWeekTotal - prevWeekTotal) / prevWeekTotal) * 100).toFixed(1));
          comparison = diff <= 0
            ? ` — down ${Math.abs(diff)}% from the week before! 🎉`
            : ` — up ${Math.abs(diff)}% from the week before.`;
        }

        await sendNotification(
          userId,
          `📊 Last week you emitted ${parseFloat(lastWeekTotal.toFixed(2))} kg CO₂${comparison}`,
          'summary',
          168 // don't repeat within 7 days
        );
      }
    }

    // ── 3. FIRST ACTIVITY OF THE DAY ────────────────────────────────────────
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const actsToday = await Activity.find({ userId: uid, date: { $gte: todayStart } });

    if (actsToday.length === 1) {
      // This is the very first log today
      await sendNotification(
        userId,
        `🌱 Good start! You have logged your first activity today. Keep tracking!`,
        'general',
        20 // don't repeat within 20 hours
      );
    }

    // ── 4. STREAK NOTIFICATIONS ─────────────────────────────────────────────
    // Count how many consecutive days (including today) the user has logged
    let streak = 0;
    let checkDate = new Date(now);

    for (let i = 0; i < 365; i++) {
      const dayStart = new Date(checkDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayActs = await Activity.find({ userId: uid, date: { $gte: dayStart, $lte: dayEnd } });

      if (dayActs.length > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1); // go back one day
      } else {
        break; // streak broken
      }
    }

    // Notify on milestone streaks: 3, 7, 14, 30 days
    const milestones = [3, 7, 14, 30];
    if (milestones.includes(streak)) {
      const messages = {
        3:  `🔥 3-day streak! You have logged activities 3 days in a row. Keep it up!`,
        7:  `🔥 7-day streak! A full week of tracking — you are building a great habit!`,
        14: `🔥 14-day streak! Two weeks straight — you are a carbon tracking pro!`,
        30: `🔥 30-day streak! An entire month of consistent tracking — absolutely incredible!`,
      };
      await sendNotification(userId, messages[streak], 'streak', 22);
    }

    // ── 5. INACTIVITY REMINDER ──────────────────────────────────────────────
    // This runs on login (auth), not here — but we add a check:
    // If the user just logged after a long gap, send a welcome-back message
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);
    threeDaysAgo.setHours(0, 0, 0, 0);

    const recentActs = await Activity.find({
      userId: uid,
      date: { $gte: threeDaysAgo, $lt: todayStart } // yesterday and day before, not today
    });

    if (recentActs.length === 0 && actsToday.length === 1) {
      // No logs in 3+ days but just logged now
      const lastAct = await Activity.findOne({ userId: uid, date: { $lt: todayStart } }).sort({ date: -1 });
      if (lastAct) {
        const daysSince = Math.floor((todayStart - new Date(lastAct.date)) / (1000 * 60 * 60 * 24));
        if (daysSince >= 3) {
          await sendNotification(
            userId,
            `👋 Welcome back! It has been ${daysSince} days since your last log. Great to see you tracking again!`,
            'inactivity',
            48
          );
        }
      }
    }

  } catch (err) {
    // Never let notification errors break the main activity save
    console.error('Notification engine error:', err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const createActivity = async (req, res) => {
  try {
    const { type, data, date } = req.body;
    const co2 = calculateCO2(type, data);

    const activity = await Activity.create({
      userId: req.user.id,
      type,
      data,
      co2Emissions: co2,
      date: date ? new Date(date) : new Date(),
    });

    // Run all notification checks in background (non-blocking)
    // 1. Achievement badges
    const newBadges = await checkAchievements(req.user.id);
    for (const badge of newBadges) {
      await sendNotification(
        req.user.id,
        `🏆 Achievement unlocked: ${badge.name}! ${badge.description}`,
        'achievement'
      );
    }

    // 2–6. All other smart notifications
    runNotificationEngine(req.user.id, activity); // intentionally not awaited — runs in background

    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getActivities = async (req, res) => {
  try {
    const { type, range, search } = req.query;
    const filter = { userId: req.user.id };

    if (type && type !== 'All') {
      filter.type = type.toLowerCase();
    }

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
