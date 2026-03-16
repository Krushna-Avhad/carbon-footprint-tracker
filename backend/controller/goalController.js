const Goal = require('../models/GoalM');
const Activity = require('../models/ActivityM');
const mongoose = require('mongoose');

// POST /api/goals
const createGoal = async (req, res) => {
  try {
    const { name, category, targetKgCO2, endDate } = req.body;
    const goal = new Goal({
      userId: req.user.id,
      name: name || 'Carbon Reduction Goal',
      category: category || 'overall',
      targetKgCO2,
      endDate,
    });
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/goals
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ startDate: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Shared helper — computes progress data for a single goal
const computeProgress = async (goal, userId) => {
  const filter = {
    userId,
    date: { $gte: goal.startDate, $lte: goal.endDate },
  };
  if (goal.category !== 'overall') filter.type = goal.category;

  const activities     = await Activity.find(filter);
  const totalEmissions = activities.reduce((sum, a) => sum + (a.co2Emissions || 0), 0);
  const progressPercent = parseFloat(
    Math.min(100, ((totalEmissions / goal.targetKgCO2) * 100)).toFixed(1)
  );

  const now      = new Date();
  const end      = new Date(goal.endDate);
  const isExpired = now >= end;

  const daysLeft = Math.max(
    0,
    Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  );

  // Determine completion result for expired goals
  const succeeded = isExpired && totalEmissions <= goal.targetKgCO2;
  const failed    = isExpired && totalEmissions > goal.targetKgCO2;

  // Auto-mark achieved in DB if succeeded
  if (succeeded && !goal.achieved) {
    await Goal.findByIdAndUpdate(goal._id, { achieved: true });
  }

  // Status label
  let status;
  if (succeeded)                    status = 'Completed ✅';
  else if (failed)                  status = 'Missed ❌';
  else if (progressPercent >= 90)   status = 'Needs Work';
  else if (progressPercent <= 40)   status = 'Ahead';
  else                              status = 'On Track';

  // Motivational message
  let message = '';
  if (succeeded) {
    const saved = parseFloat((goal.targetKgCO2 - totalEmissions).toFixed(2));
    message = `🎉 Amazing! You stayed ${saved} kg under your target. Goal achieved!`;
  } else if (failed) {
    const over = parseFloat((totalEmissions - goal.targetKgCO2).toFixed(2));
    message = `You exceeded your target by ${over} kg. Set a new goal and keep improving!`;
  } else if (progressPercent >= 90) {
    message = `⚠️ You are close to your limit. Try to reduce emissions before the deadline.`;
  } else if (progressPercent <= 40) {
    message = `✅ You are well ahead of your target. Keep it up!`;
  } else {
    message = `📊 You are on track. ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left to reach your goal.`;
  }

  return {
    goalId:          goal._id,
    name:            goal.name,
    category:        goal.category,
    targetKgCO2:     goal.targetKgCO2,
    totalEmissions:  parseFloat(totalEmissions.toFixed(2)),
    progressPercent,
    endDate:         goal.endDate,
    startDate:       goal.startDate,
    daysLeft,
    status,
    message,
    isExpired,
    succeeded,
    failed,
    achieved:        goal.achieved || succeeded,
  };
};

// GET /api/goals/progress — returns ALL goals split into active and past
const getGoalProgress = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Fetch ALL goals (active + expired + achieved)
    const allGoals = await Goal.find({ userId: req.user.id }).sort({ endDate: -1 });

    const results = await Promise.all(
      allGoals.map(goal => computeProgress(goal, userId))
    );

    // Split into active and past
    const active = results.filter(g => !g.isExpired);
    const past   = results.filter(g => g.isExpired);

    res.json({ active, past });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/goals/:id
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createGoal, getGoals, getGoalProgress, deleteGoal };
