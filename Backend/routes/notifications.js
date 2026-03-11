const express = require('express');
const router = express.Router();
const { getNotifications, markRead } = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getNotifications);
router.put('/:id/read', auth, markRead);

module.exports = router;