const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const auth = require('../middleware/authMiddleware');

router.get('/:period', auth, getAnalytics);

module.exports = router;