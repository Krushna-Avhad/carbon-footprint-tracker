const express = require('express');
const mongoose = require('mongoose');
const Database = require('./config/db.js');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');




const app = express();

app.use(cors());
app.use(express.json());
Database();

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));







































// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/activities', activityRoutes);
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/goals', goalRoutes);
// app.use('/api/achievements', achievementRoutes);
// app.use('/api/articles', articleRoutes);
// app.use('/api/notifications', notificationRoutes);

// MongoDB connection







// const authRoutes = require('./routes/auth');
// const activityRoutes = require('./routes/activities');
// const analyticsRoutes = require('./routes/analytics');
// const goalRoutes = require('./routes/goals');
// const achievementRoutes = require('./routes/achievements');
// const articleRoutes = require('./routes/articles');
// const notificationRoutes = require('./routes/notifications');