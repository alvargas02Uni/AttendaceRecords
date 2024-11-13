const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/user.controller');
const { authMiddleware } = require('../util/authMiddleware');
const router = express.Router();

// Rutas públicas para registro y login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rutas protegidas por autenticación para el perfil de usuario
router.get('/profile', authMiddleware('student'), getUserProfile);
router.put('/profile', authMiddleware('student'), updateUserProfile);

module.exports = router;
