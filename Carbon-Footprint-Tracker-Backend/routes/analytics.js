const express = require('express');
const router  = express.Router();
const { getAnalytics, getMonthlyTrend, getSummary } = require('../controller/analyticsController');
const auth = require('../middleware/authMiddleware');

router.get('/summary',        auth, getSummary);
router.get('/trend/monthly',  auth, getMonthlyTrend);
router.get('/:period',        auth, getAnalytics);

module.exports = router;
