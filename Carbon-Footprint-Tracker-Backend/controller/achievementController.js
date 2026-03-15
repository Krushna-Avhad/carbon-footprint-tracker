const Achievement = require('../models/AchievementM');
const Activity    = require('../models/ActivityM');

const ALL_BADGES = [
  { name: 'Green Starter',   type: 'firstActivity',  desc: 'Logged your first activity',          icon: '🌱' },
  { name: 'Eco Traveler',    type: 'transport10',     desc: 'Used sustainable transport 10 times', icon: '🚴' },
  { name: 'Waste Warrior',   type: 'recycle7',        desc: 'Recycled / composted for 7 days',     icon: '♻️' },
  { name: 'Energy Saver',    type: 'energy5',         desc: 'Logged energy activity 5 times',      icon: '⚡' },
  { name: 'Plant Powered',   type: 'veggie10',        desc: 'Logged 10 plant-based meals',         icon: '🥗' },
  { name: 'Carbon Hero',     type: 'total50',         desc: 'Logged 50 activities total',          icon: '🌍' },
];

// Internal: check and award badges — called after every activity log
const checkAchievements = async (userId) => {
  const activities = await Activity.find({ userId });
  const newAchievements = [];

  const earned = async (badge) => {
    const exists = await Achievement.findOne({ userId, name: badge.name });
    if (!exists) {
      const ach = new Achievement({ userId, name: badge.name, description: badge.desc });
      await ach.save();
      newAchievements.push(ach);
    }
  };

  // Green Starter
  if (activities.length >= 1) await earned(ALL_BADGES[0]);

  // Eco Traveler — bus/train/bike 10 times
  const greenTransport = activities.filter(a =>
    a.type === 'transport' &&
    ['bus', 'train', 'bike'].includes((a.data?.mode || '').toLowerCase())
  );
  if (greenTransport.length >= 10) await earned(ALL_BADGES[1]);

  // Waste Warrior — 7 unique days with waste/recycling
  const wasteActs = activities.filter(a => a.type === 'waste');
  const uniqueWasteDays = new Set(wasteActs.map(a => new Date(a.date).toDateString())).size;
  if (uniqueWasteDays >= 7) await earned(ALL_BADGES[2]);

  // Energy Saver — 5 energy logs
  const energyActs = activities.filter(a => a.type === 'energy');
  if (energyActs.length >= 5) await earned(ALL_BADGES[3]);

  // Plant Powered — 10 plant-based meals
  const veggieActs = activities.filter(a =>
    a.type === 'food' &&
    ['veg', 'vegan', 'vegetarian'].includes((a.data?.meal || '').toLowerCase())
  );
  if (veggieActs.length >= 10) await earned(ALL_BADGES[4]);

  // Carbon Hero — 50 activities total
  if (activities.length >= 50) await earned(ALL_BADGES[5]);

  return newAchievements;
};

// GET /api/achievements  — returns earned + locked badges
const getAchievements = async (req, res) => {
  try {
    const earned = await Achievement.find({ userId: req.user.id }).sort({ dateEarned: -1 });
    const earnedNames = new Set(earned.map(a => a.name));

    const result = ALL_BADGES.map(badge => {
      const earnedEntry = earned.find(e => e.name === badge.name);
      return {
        icon: badge.icon,
        name: badge.name,
        desc: badge.desc,
        earned: earnedNames.has(badge.name),
        date: earnedEntry ? new Date(earnedEntry.dateEarned).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { checkAchievements, getAchievements };
