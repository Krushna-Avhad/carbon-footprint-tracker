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

// GET /api/goals/progress
const getGoalProgress = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const goals  = await Goal.find({ userId: req.user.id, achieved: false });

    const progress = await Promise.all(
      goals.map(async goal => {
        const filter = {
          userId,
          date: { $gte: goal.startDate, $lte: goal.endDate },
        };
        if (goal.category !== 'overall') filter.type = goal.category;

        const activities    = await Activity.find(filter);
        const totalEmissions = activities.reduce((sum, a) => sum + (a.co2Emissions || 0), 0);
        const progressPercent = parseFloat(
          Math.min(100, ((totalEmissions / goal.targetKgCO2) * 100)).toFixed(1)
        );

        // Auto-mark achieved
        if (totalEmissions <= goal.targetKgCO2 && new Date() >= new Date(goal.endDate)) {
          await Goal.findByIdAndUpdate(goal._id, { achieved: true });
        }

        const daysLeft = Math.max(
          0,
          Math.ceil((new Date(goal.endDate) - new Date()) / (1000 * 60 * 60 * 24))
        );

        let status = 'On Track';
        if (progressPercent >= 90)      status = 'Needs Work';
        else if (progressPercent <= 40) status = 'Ahead';
        else                            status = 'On Track';

        return {
          goalId: goal._id,
          name: goal.name,
          category: goal.category,
          targetKgCO2: goal.targetKgCO2,
          totalEmissions: parseFloat(totalEmissions.toFixed(2)),
          progressPercent,
          endDate: goal.endDate,
          daysLeft,
          status,
        };
      })
    );

    res.json(progress);
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
