const express = require('express');
const router = express.Router();
const { getAchievements } = require('../controller/achievementController');

router.get('/:userId', getAchievements);

module.exports = router;