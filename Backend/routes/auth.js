const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controller/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);

module.exports = router;