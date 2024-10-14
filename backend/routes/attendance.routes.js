const express = require('express');
const { registerAttendance, endAttendance, getAttendances, getActiveAttendance } = require('../controllers/attendance.controller');
const router = express.Router();

router.post('/attendance', registerAttendance);
router.put('/attendance/:id/end', endAttendance);
router.get('/attendance', getAttendances);
router.get('/attendance/active/:user_code', getActiveAttendance); 
router.put('/attendance/end/:user_code', endAttendance); 

module.exports = router;