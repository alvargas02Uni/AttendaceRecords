// labs.routes.js

const express = require('express');
const { body, param } = require('express-validator');
const {
  getAllLabs,
  getLabById,
  createLab,
  updateLab,
  deleteLab,
} = require('../controllers/labs.controller');
const { authMiddleware } = require('../util/authMiddleware');

const router = express.Router();

router.get('/get', authMiddleware('student'), getAllLabs);

router.get('/get/:id', authMiddleware('student'), [
  param('id').isInt().withMessage('El ID debe ser un número entero'),
], getLabById);

router.post('/create', authMiddleware('admin'), [
  body('lab_name').notEmpty().withMessage('lab_name es requerido').isLength({ max: 255 }).withMessage('lab_name excede la longitud máxima'),
], createLab);

router.put('/update/:id', authMiddleware('admin'), [
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  body('lab_name').notEmpty().withMessage('lab_name es requerido').isLength({ max: 255 }).withMessage('lab_name excede la longitud máxima'),
], updateLab);

router.delete('/delete/:id', authMiddleware('admin'), [
  param('id').isInt().withMessage('El ID debe ser un número entero'),
], deleteLab);

module.exports = router;
