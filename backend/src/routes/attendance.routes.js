const express = require('express');
const { registerAttendance, endAttendance, getAllAttendances, getAttendanceByUser } = require('../controllers/attendance.controller');
const { authMiddleware } = require('../util/authMiddleware');
const router = express.Router();

// Ruta para registrar asistencia, solo estudiantes
router.post('/attendance', authMiddleware('student'), registerAttendance);

// Ruta para finalizar la asistencia de un estudiante
router.put('/attendance/:att_id/end', authMiddleware('student'), endAttendance);

// Ruta para que un administrador vea todas las asistencias
router.get('/attendance', authMiddleware('admin'), getAllAttendances);

// Ruta para que un estudiante vea su propia asistencia activa
router.get('/attendance/active/:user_id', authMiddleware('student'), getAttendanceByUser);

module.exports = router;
