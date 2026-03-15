const express = require('express');
const router  = express.Router();
const { getAchievements } = require('../controller/achievementController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getAchievements);

module.exports = router;
