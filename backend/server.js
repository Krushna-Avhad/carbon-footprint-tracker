const express  = require('express');
const Database = require('./config/db.js');
const cors     = require('cors');
require('dotenv').config();

const authRoutes         = require('./routes/auth');
const activityRoutes     = require('./routes/activities.js');
const analyticsRoutes    = require('./routes/analytics.js');
const goalRoutes         = require('./routes/goals.js');
const achievementRoutes  = require('./routes/achievement.js');
const articleRoutes      = require('./routes/articles.js');
const notificationRoutes = require('./routes/notifications.js');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/auth',          authRoutes);
app.use('/api/activities',    activityRoutes);
app.use('/api/analytics',     analyticsRoutes);
app.use('/api/goals',         goalRoutes);
app.use('/api/achievements',  achievementRoutes);
app.use('/api/articles',      articleRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// Connect to MongoDB then start server
Database().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});