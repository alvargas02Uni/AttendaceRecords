const express = require('express');
const { registerAttendance, endAttendance, getAllAttendances, getAttendanceByUser } = require('../controllers/attendance.controller');
const { authMiddleware } = require('../util/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Endpoints relacionados con la asistencia de estudiantes
 */

/**
 * @swagger
 * /attendance/attendance:
 *   post:
 *     summary: Registrar la asistencia de un estudiante
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lab_id:
 *                 type: integer
 *                 description: ID del laboratorio
 *     responses:
 *       201:
 *         description: Asistencia registrada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 att_id:
 *                   type: integer
 *                   description: ID de la asistencia
 *                 user_id:
 *                   type: integer
 *                   description: ID del usuario que registra la asistencia
 *                 lab_id:
 *                   type: integer
 *                   description: ID del laboratorio
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: El estudiante ya tiene una asistencia activa en este laboratorio
 */
router.post('/attendance', authMiddleware('student'), registerAttendance);

/**
 * @swagger
 * /attendance/attendance/{att_id}/end:
 *   put:
 *     summary: Finalizar la asistencia de un estudiante
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: att_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la asistencia
 *     responses:
 *       200:
 *         description: Asistencia finalizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 att_id:
 *                   type: integer
 *                   description: ID de la asistencia finalizada
 *                 att_end_time:
 *                   type: string
 *                   format: date-time
 *                   description: Hora de finalización de la asistencia
 *       404:
 *         description: No se encontró una asistencia activa
 *       400:
 *         description: Error en los datos proporcionados
 */
router.put('/attendance/:att_id/end', authMiddleware('student'), endAttendance);

/**
 * @swagger
 * /attendance/attendance:
 *   get:
 *     summary: Obtener todas las asistencias (solo administradores)
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las asistencias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   att_id:
 *                     type: integer
 *                     description: ID de la asistencia
 *                   user_id:
 *                     type: integer
 *                     description: ID del usuario
 *                   lab_id:
 *                     type: integer
 *                     description: ID del laboratorio
 *                   att_end_time:
 *                     type: string
 *                     format: date-time
 *                     description: Hora de finalización de la asistencia (si aplica)
 *       401:
 *         description: No autorizado
 */
router.get('/attendance', authMiddleware('admin'), getAllAttendances);

/**
 * @swagger
 * /attendance/attendance/active/{user_id}:
 *   get:
 *     summary: Obtener la asistencia activa de un usuario específico
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Asistencia activa del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 att_id:
 *                   type: integer
 *                   description: ID de la asistencia activa
 *                 user_id:
 *                   type: integer
 *                   description: ID del usuario
 *                 lab_id:
 *                   type: integer
 *                   description: ID del laboratorio
 *       404:
 *         description: No hay asistencias activas para este usuario
 *       401:
 *         description: No autorizado
 */
router.get('/attendance/active/:user_id', authMiddleware('student'), getAttendanceByUser);

module.exports = router;
