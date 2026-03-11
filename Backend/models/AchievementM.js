const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  badge: String,
  ecoScore: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Achievement', AchievementSchema);