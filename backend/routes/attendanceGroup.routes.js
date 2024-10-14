const express = require('express');
const { createGroup, joinGroup, getGroupMembers } = require('../controllers/attendanceGroup.controller');
const router = express.Router();

router.post('/group', createGroup); // Crear un nuevo grupo
router.post('/group/join', joinGroup); // Unirse a un grupo existente
router.get('/group/:group_code/members', getGroupMembers); // Obtener los miembros de un grupo

module.exports = router;