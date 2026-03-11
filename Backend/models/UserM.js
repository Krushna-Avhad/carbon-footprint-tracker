
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  country: String,
  lifestylePreferences: {
    dietType: String,
    transportPreference: String,
    householdSize: Number
  },
  profile: {
    location: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);