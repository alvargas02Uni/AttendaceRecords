const { Router } = require('express');
const { getAllLabs, getLabById, createLab, updateLab, deleteLab } = require('../controllers/labs.controller');
const { studentAuthMiddleware, adminAuthMiddleware } = require('../util/authMiddleware');
const router = Router();

// Rutas accesibles para estudiantes y administradores
router.get('/labs', studentAuthMiddleware, getAllLabs);
router.get('/labs/:id', studentAuthMiddleware, getLabById);

// Rutas accesibles solo para administradores
router.post('/labs', adminAuthMiddleware, createLab);
router.put('/labs/:id', adminAuthMiddleware, updateLab);
router.delete('/labs/:id', adminAuthMiddleware, deleteLab);

module.exports = router;
