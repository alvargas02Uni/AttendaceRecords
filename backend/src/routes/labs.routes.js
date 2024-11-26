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
  param('id').isInt().withMessage('ID must be an integer'),
], getLabById);

router.post('/create', authMiddleware('admin'), [
  body('lab_name')
    .notEmpty()
    .withMessage('lab_name is required')
    .isLength({ max: 255 })
    .withMessage('lab_name exceeds maximum length'),
], createLab);

router.put('/update/:id', authMiddleware('admin'), [
  param('id').isInt().withMessage('ID must be an integer'),
  body('lab_name')
    .notEmpty()
    .withMessage('lab_name is required')
    .isLength({ max: 255 })
    .withMessage('lab_name exceeds maximum length'),
], updateLab);

router.delete('/delete/:id', authMiddleware('admin'), [
  param('id').isInt().withMessage('ID must be an integer'),
], deleteLab);

module.exports = router;
