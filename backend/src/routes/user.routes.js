const express = require('express');
const { body } = require('express-validator'); 
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/user.controller');
const { authMiddleware } = require('../util/authMiddleware');

const router = express.Router();

router.post('/register', [
  body('user_name').notEmpty().withMessage('user_name is required'),
  body('user_surname').notEmpty().withMessage('user_surname is required'),
  body('user_email').isEmail().withMessage('Invalid email'),
  body('user_password').notEmpty().withMessage('user_password is required'),
  body('user_gender').notEmpty().withMessage('user_gender is required'),
  body('user_age').isInt().withMessage('user_age must be a number'),
  body('user_degree').notEmpty().withMessage('user_degree is required'),
  body('user_zipcode').notEmpty().withMessage('user_zipcode is required'),
], registerUser);

router.post('/login', [
  body('user_email').isEmail().withMessage('Invalid email'),
  body('user_password').notEmpty().withMessage('user_password is required'),
], loginUser);

router.get('/profile', authMiddleware('student'), getUserProfile);

router.put('/profile', authMiddleware('student'), [
  body('user_name').optional(),
  body('user_surname').optional(),
  body('user_email').optional().isEmail().withMessage('Invalid email'),
  body('user_password').optional(),
  body('user_gender').optional(),
  body('user_age').optional().isInt().withMessage('user_age must be a number'),
  body('user_degree').optional(),
  body('user_zipcode').optional(),
], updateUserProfile);

module.exports = router;
