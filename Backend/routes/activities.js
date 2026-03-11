const express = require('express');
const router = express.Router();
const { logActivity, getActivities } = require('../controllers/activityController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, logActivity);
router.get('/', auth, getActivities);

module.exports = router;