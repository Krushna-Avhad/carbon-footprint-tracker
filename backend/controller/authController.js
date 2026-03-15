const User         = require('../models/UserM');
const bcrypt       = require('bcryptjs');
const jwt          = require('jsonwebtoken');
const Activity     = require('../models/ActivityM');
const Goal         = require('../models/GoalM');
const Achievement  = require('../models/AchievementM');
const Notification = require('../models/NotificationM');

const register = async (req, res) => {
  try {
    const { name, email, password, country, dietType } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      country: country || '',
      lifestylePreferences: {
        dietType: dietType || '',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Incorrect password.' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, country, dietType, carbonGoal, transportPreference, householdSize } = req.body;

    const updateData = {};
    if (name    !== undefined) updateData.name    = name;
    if (email   !== undefined) updateData.email   = email;
    if (country !== undefined) updateData.country = country;
    if (carbonGoal !== undefined) updateData.carbonGoal = carbonGoal;

    // Build nested lifestyle prefs update
    const prefs = {};
    if (dietType            !== undefined) prefs.dietType            = dietType;
    if (transportPreference !== undefined) prefs.transportPreference = transportPreference;
    if (householdSize       !== undefined) prefs.householdSize       = householdSize;
    if (Object.keys(prefs).length > 0) updateData.lifestylePreferences = prefs;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.json(updated);
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect.' });

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error('changePassword error:', err);
    res.status(500).json({ message: err.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required to delete account.' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Incorrect password.' });

    await Activity.deleteMany({ userId: req.user.id });
    await Goal.deleteMany({ userId: req.user.id });
    await Achievement.deleteMany({ userId: req.user.id });
    await Notification.deleteMany({ userId: req.user.id });
    await User.findByIdAndDelete(req.user.id);

    res.json({ success: true, message: 'Account deleted successfully.' });
  } catch (err) {
    console.error('deleteAccount error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword, deleteAccount };
