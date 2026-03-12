const express = require('express');
const router = express.Router();
const { createGoal, getGoals, getGoalProgress } = require('../controller/goalController');

router.post('/', createGoal); // Create new goal
router.get('/:userId', getGoals); // Get all goals
router.get('/progress/:userId', getGoalProgress); // Get progress

module.exports = router;