// attendance.routes.js

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

router.post('/attendance', authMiddleware('student'), [
  body('lab_id').isInt().withMessage('lab_id must be an integer'),
], registerAttendance);

router.put('/attendance/:att_id/end', authMiddleware('student'), [
  param('att_id').isInt().withMessage('att_id must be an integer'),
], endAttendance);

router.get('/attendance', authMiddleware('admin'), getAllAttendances);

router.get('/attendance/active/:user_id', authMiddleware('student'), [
  param('user_id').isInt().withMessage('user_id must be an integer'),
], getAttendanceByUser);

module.exports = router;
