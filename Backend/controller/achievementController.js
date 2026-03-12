const Achievement = require('../models/AchievementM');
const Activity = require('../models/ActivityM');

// Example badge rules
const BADGE_RULES = [
  { name: "🌱 Green Starter", type: "firstActivity", desc: "Logged first activity" },
  { name: "🚴 Eco Traveler", type: "transport10", desc: "Used sustainable transport 10 times" },
  { name: "♻ Waste Warrior", type: "recycle7", desc: "Recycled for 7 days" }
];

// Generate badges
const checkAchievements = async (userId) => {
  const activities = await Activity.find({ userId });
  const earned = [];

  // First activity
  if (activities.length >= 1) earned.push(BADGE_RULES[0]);

  // Transport 10
  const transportCount = activities.filter(a => a.type === 'transport').length;
  if (transportCount >= 10) earned.push(BADGE_RULES[1]);

  // Recycling 7 days
  const wasteActivities = activities.filter(a => a.type === 'waste');
  const uniqueDays = new Set(wasteActivities.map(a => a.date.toDateString())).size;
  if (uniqueDays >= 7) earned.push(BADGE_RULES[2]);

  // Save new achievements
  const newAchievements = [];
  for (let badge of earned) {
    const exists = await Achievement.findOne({ userId, name: badge.name });
    if (!exists) {
      const ach = new Achievement({ userId, name: badge.name, description: badge.desc });
      await ach.save();
      newAchievements.push(ach);
    }
  }
  return newAchievements;
}

// Get all achievements
const getAchievements = async (req, res) => {
  try {
    const userId = req.params.userId;
    const achievements = await Achievement.find({ userId });
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { checkAchievements, getAchievements };