const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controller/notificationController');

router.get('/:userId', getNotifications);
router.put('/:id/read', markAsRead);

module.exports = router;