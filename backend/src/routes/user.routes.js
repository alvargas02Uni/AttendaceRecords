const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/user.controller');
const { authMiddleware } = require('../util/authMiddleware');
const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware('student'), getUserProfile);
router.put('/profile', authMiddleware('student'), updateUserProfile);

module.exports = router;
