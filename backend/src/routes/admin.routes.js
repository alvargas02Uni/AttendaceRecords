const express = require('express');
const { registerAdmin, loginAdmin, getAllAdmins, updateAdmin } = require('../controllers/admin.controller');
const { authMiddleware } = require('../util/authMiddleware');

const router = express.Router();

// Ruta pública para que los administradores hagan login
router.post('/login', loginAdmin);

// Rutas protegidas para administración de usuarios
router.post('/register', authMiddleware('admin'), registerAdmin);
router.get('/admins', authMiddleware('admin'), getAllAdmins);
router.put('/admins/:id', authMiddleware('admin'), updateAdmin);

module.exports = router;
