const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const adminController = require('../controllers/admin.controller');
const { authMiddleware } = require('../util/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin management
 */

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - admin_name
 *               - admin_surname
 *               - admin_email
 *               - admin_password
 *             properties:
 *               admin_name:
 *                 type: string
 *               admin_surname:
 *                 type: string
 *               admin_email:
 *                 type: string
 *                 format: email
 *               admin_password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', [
  body('admin_name').notEmpty().withMessage('El nombre es requerido'),
  body('admin_surname').notEmpty().withMessage('El apellido es requerido'),
  body('admin_email').isEmail().withMessage('El correo electrónico es inválido'),
  body('admin_password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], adminController.registerAdmin);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - admin_email
 *               - admin_password
 *             properties:
 *               admin_email:
 *                 type: string
 *                 format: email
 *               admin_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error or invalid credentials
 */
router.post('/login', [
  body('admin_email').isEmail().withMessage('El correo electrónico es inválido'),
  body('admin_password').notEmpty().withMessage('La contraseña es requerida'),
], adminController.loginAdmin);

/**
 * @swagger
 * /admin/admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admins
 *       401:
 *         description: Unauthorized
 */
router.get('/admins', authMiddleware('admin'), adminController.getAllAdmins);

/**
 * @swagger
 * /admin/admins/{id}:
 *   put:
 *     summary: Update admin details
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Admin ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               admin_name:
 *                 type: string
 *               admin_surname:
 *                 type: string
 *               admin_email:
 *                 type: string
 *                 format: email
 *               admin_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put('/admins/:id', authMiddleware('admin'), [
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  body('admin_name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('admin_surname').optional().notEmpty().withMessage('El apellido no puede estar vacío'),
  body('admin_email').optional().isEmail().withMessage('El correo electrónico es inválido'),
  body('admin_password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], adminController.updateAdmin);

module.exports = router;
