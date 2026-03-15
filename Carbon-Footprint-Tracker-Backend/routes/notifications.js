const express = require('express');
const router  = express.Router();
const { getNotifications, markAsRead, markAllRead, deleteNotification } = require('../controller/notificationController');
const auth = require('../middleware/authMiddleware');

router.get('/',                     auth, getNotifications);
router.put('/mark-all-read',        auth, markAllRead);
router.put('/:id/read',             auth, markAsRead);
router.delete('/:id',               auth, deleteNotification);

module.exports = router;
