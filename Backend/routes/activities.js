const express = require('express');
const router = express.Router();

const { createActivity, getActivities } = require('../controller/activityController');

const auth = require('../middleware/authMiddleware');

router.post('/', auth, createActivity);   // log new activity
router.get('/', auth, getActivities);     // get user activities

module.exports = router;