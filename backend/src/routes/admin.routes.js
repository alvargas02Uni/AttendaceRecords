const express = require('express');
const { registerAdmin, loginAdmin, getAllAdmins, updateAdmin } = require('../controllers/admin.controller');
const { authMiddleware } = require('../util/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints relacionados con la administración
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Login de administrador
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               admin_email:
 *                 type: string
 *                 description: Correo del administrador
 *               admin_password:
 *                 type: string
 *                 description: Contraseña del administrador
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve un token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Credenciales inválidas
 */
router.post('/login', loginAdmin);

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Registro de un nuevo administrador
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               admin_name:
 *                 type: string
 *                 description: Nombre del administrador
 *               admin_surname:
 *                 type: string
 *                 description: Apellido del administrador
 *               admin_email:
 *                 type: string
 *                 description: Correo del administrador
 *               admin_password:
 *                 type: string
 *                 description: Contraseña del administrador
 *     responses:
 *       201:
 *         description: Administrador registrado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: El administrador ya existe o datos inválidos
 */
router.post('/register', authMiddleware('admin'), registerAdmin);

/**
 * @swagger
 * /admin/admins:
 *   get:
 *     summary: Obtener todos los administradores
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los administradores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   admin_id:
 *                     type: integer
 *                     description: ID del administrador
 *                   admin_name:
 *                     type: string
 *                     description: Nombre del administrador
 *                   admin_surname:
 *                     type: string
 *                     description: Apellido del administrador
 *                   admin_email:
 *                     type: string
 *                     description: Correo del administrador
 *       401:
 *         description: No autorizado
 */
router.get('/admins', authMiddleware('admin'), getAllAdmins);

/**
 * @swagger
 * /admin/admins/{id}:
 *   put:
 *     summary: Actualizar información de un administrador
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del administrador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               admin_name:
 *                 type: string
 *                 description: Nombre del administrador
 *               admin_surname:
 *                 type: string
 *                 description: Apellido del administrador
 *               admin_email:
 *                 type: string
 *                 description: Correo del administrador
 *               admin_password:
 *                 type: string
 *                 description: Contraseña del administrador (opcional)
 *     responses:
 *       200:
 *         description: Información del administrador actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admin_id:
 *                   type: integer
 *                 admin_name:
 *                   type: string
 *                 admin_surname:
 *                   type: string
 *                 admin_email:
 *                   type: string
 *       404:
 *         description: Administrador no encontrado
 *       400:
 *         description: Datos inválidos
 */
router.put('/admins/:id', authMiddleware('admin'), updateAdmin);

module.exports = router;
