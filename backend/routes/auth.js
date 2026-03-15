const express = require('express');
const router  = express.Router();
const { register, login, getProfile, updateProfile, changePassword, deleteAccount } = require('../controller/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register',         register);
router.post('/login',            login);
router.get('/me',                auth, getProfile);
router.put('/me',                auth, updateProfile);
router.put('/change-password',   auth, changePassword);
router.delete('/account',        auth, deleteAccount);

module.exports = router;
