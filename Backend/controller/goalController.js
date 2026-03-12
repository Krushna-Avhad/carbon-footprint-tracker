const Goal = require('../models/GoalM');
const Activity = require('../models/ActivityM');

// Create a new goal
const createGoal = async (req, res) => {
  try {
    const { userId, targetKgCO2, endDate } = req.body;
    const goal = new Goal({ userId, targetKgCO2, endDate });
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all goals for a user
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.params.userId });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get progress for active goals
const getGoalProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const goals = await Goal.find({ userId, achieved: false });

    const progress = await Promise.all(goals.map(async goal => {
    const activities = await Activity.find({ userId, date: { $gte: goal.startDate, $lte: goal.endDate } });
    const totalEmissions = activities.reduce((sum, a) => sum + a.co2Emissions, 0);

      return {
        goalId: goal._id,
        name: goal.name,
        targetKgCO2: goal.targetKgCO2,
        totalEmissions: parseFloat(totalEmissions.toFixed(2)),
        progressPercent: Math.min(100, ((totalEmissions / goal.targetKgCO2) * 100).toFixed(2))
      };
    }));

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createGoal, getGoals, getGoalProgress };