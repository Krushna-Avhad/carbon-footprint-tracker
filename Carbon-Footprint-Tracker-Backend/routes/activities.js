const express = require('express');
const router  = express.Router();
const { createActivity, getActivities, deleteActivity, updateActivity } = require('../controller/activityController');
const auth = require('../middleware/authMiddleware');

router.post('/',        auth, createActivity);
router.get('/',         auth, getActivities);
router.put('/:id',      auth, updateActivity);
router.delete('/:id',   auth, deleteActivity);

module.exports = router;
