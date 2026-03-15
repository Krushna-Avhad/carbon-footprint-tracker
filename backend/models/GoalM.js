const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
   },
  name: { 
    type: String, 
    default: "Carbon Reduction Goal" 
  },
    category : {
       type: String, 
     enum: ['transport', 'food', 'energy', 'waste', 'overall'],
     default : "overall"
    },
  targetKgCO2: { 
    type: Number, 
    required: true
   },
  startDate: { 
    type: Date, 
    default: Date.now
   },
  endDate: {
     type: Date, 
     required: true
     },
  achieved: { 
    type: Boolean, 
    default: false 
  }
 
});

module.exports = mongoose.model('Goal', GoalSchema);