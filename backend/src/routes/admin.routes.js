const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const adminController = require('../controllers/admin.controller');
const { authMiddleware } = require('../util/authMiddleware'); // Asegúrate de tener este middleware

router.post('/register', [
  body('admin_name').notEmpty().withMessage('El nombre es requerido'),
  body('admin_surname').notEmpty().withMessage('El apellido es requerido'),
  body('admin_email').isEmail().withMessage('El correo electrónico es inválido'),
  body('admin_password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], adminController.registerAdmin);

router.post('/login', [
  body('admin_email').isEmail().withMessage('El correo electrónico es inválido'),
  body('admin_password').notEmpty().withMessage('La contraseña es requerida'),
], adminController.loginAdmin);

router.get('/admins', authMiddleware('admin'), adminController.getAllAdmins);

router.put('/admins/:id', authMiddleware('admin'), [
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  body('admin_name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('admin_surname').optional().notEmpty().withMessage('El apellido no puede estar vacío'),
  body('admin_email').optional().isEmail().withMessage('El correo electrónico es inválido'),
  body('admin_password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], adminController.updateAdmin);

module.exports = router;
