const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  monthlyBudget: Number,
  targetReductionPercent: Number,
  progress: Number,
  startDate: Date,
  endDate: Date
});

module.exports = mongoose.model('Goal', GoalSchema);