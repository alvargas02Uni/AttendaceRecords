const express = require('express');
const { registerAttendance, endAttendance, getAllAttendances, getAttendanceByUser } = require('../controllers/attendance.controller');
const { studentAuthMiddleware, adminAuthMiddleware } = require('../util/authMiddleware');
const router = express.Router();

// Ruta para registrar asistencia, solo estudiantes
router.post('/attendance', studentAuthMiddleware, registerAttendance);

// Ruta para finalizar la asistencia de un estudiante
router.put('/attendance/:att_id/end', studentAuthMiddleware, endAttendance);

// Ruta para que un administrador vea todas las asistencias
router.get('/attendance', adminAuthMiddleware, getAllAttendances);

// Ruta para que un estudiante vea su propia asistencia activa
router.get('/attendance/active/:user_id', studentAuthMiddleware, getAttendanceByUser);

module.exports = router;
