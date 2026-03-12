const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  type: {
     type: String, 
     enum: ['transport', 'food', 'energy', 'shopping', 'waste']
     },
  data: mongoose.Mixed, // JSON for activity details
  co2Emissions: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);