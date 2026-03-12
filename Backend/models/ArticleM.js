const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['Transport','Food','Energy','Waste','General'], default: 'General' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Article', ArticleSchema);