const express = require('express');
const { body, param } = require('express-validator');
const {
  registerAttendance,
  endAttendance,
  getAllAttendances,
  getAttendanceByUser,
} = require('../controllers/attendance.controller');
const { authMiddleware } = require('../util/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance management
 */


/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Register attendance
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lab_id
 *             properties:
 *               lab_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Attendance registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/', authMiddleware, [
  body('lab_id').isInt().withMessage('lab_id must be an integer'),
], registerAttendance);

/**
 * @swagger
 * /attendance/{att_id}/end:
 *   put:
 *     summary: End attendance
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: att_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attendance ID
 *     responses:
 *       200:
 *         description: Attendance ended successfully
 *       400:
 *         description: Validation error
 */
router.put('/:att_id/end', authMiddleware, [
  param('att_id').isInt().withMessage('att_id must be an integer'),
], endAttendance);

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Get all attendances
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all attendances
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, getAllAttendances);

/**
 * @swagger
 * /attendance/active:
 *   get:
 *     summary: Get active attendance for the authenticated user
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active attendance retrieved successfully
 *       404:
 *         description: No active attendance found
 */
router.get('/active', authMiddleware, getAttendanceByUser);

module.exports = router;
