const express = require('express');
const router  = express.Router();
const { createGoal, getGoals, getGoalProgress, deleteGoal } = require('../controller/goalController');
const auth = require('../middleware/authMiddleware');

router.post('/',          auth, createGoal);
router.get('/',           auth, getGoals);
router.get('/progress',   auth, getGoalProgress);
router.delete('/:id',     auth, deleteGoal);

module.exports = router;
