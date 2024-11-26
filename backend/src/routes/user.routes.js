// user.routes.js

const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/user.controller');
const { authMiddleware } = require('../util/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       description: User registration data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - user_surname
 *               - user_email
 *               - user_password
 *               - user_gender
 *               - user_age
 *               - user_degree
 *               - user_zipcode
 *             properties:
 *               user_name:
 *                 type: string
 *               user_surname:
 *                 type: string
 *               user_email:
 *                 type: string
 *                 format: email
 *               user_password:
 *                 type: string
 *               user_gender:
 *                 type: string
 *               user_age:
 *                 type: integer
 *               user_degree:
 *                 type: string
 *               user_zipcode:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */
// user.routes.js

router.post('/register', [
    body('user_name').notEmpty().withMessage('user_name is required'),
    body('user_surname').notEmpty().withMessage('user_surname is required'),
    body('user_email').isEmail().withMessage('Invalid email'),
    body('user_password').notEmpty().withMessage('user_password is required'),
    body('user_gender').notEmpty().withMessage('user_gender is required'),
    body('user_age').isInt().withMessage('Invalid user_age, it must be a number'),
    body('user_degree').notEmpty().withMessage('user_degree is required'),
    body('user_zipcode').notEmpty().withMessage('user_zipcode is required'),
  ], registerUser);
  
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       description: User login credentials
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_email
 *               - user_password
 *             properties:
 *               user_email:
 *                 type: string
 *                 format: email
 *               user_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */
router.post('/login', [
  body('user_email').isEmail().withMessage('Invalid email'),
  body('user_password').notEmpty().withMessage('user_password is required'),
], loginUser);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 user_name:
 *                   type: string
 *                 user_surname:
 *                   type: string
 *                 user_email:
 *                   type: string
 *                   format: email
 *                 user_gender:
 *                   type: string
 *                 user_age:
 *                   type: integer
 *                 user_degree:
 *                   type: string
 *                 user_zipcode:
 *                   type: string
 *       401:
 *         description: Unauthorized, invalid or missing token
 */
router.get('/profile', authMiddleware('student'), getUserProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: User profile data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *               user_surname:
 *                 type: string
 *               user_email:
 *                 type: string
 *                 format: email
 *               user_password:
 *                 type: string
 *               user_gender:
 *                 type: string
 *               user_age:
 *                 type: integer
 *               user_degree:
 *                 type: string
 *               user_zipcode:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 user_name:
 *                   type: string
 *                 user_surname:
 *                   type: string
 *                 user_email:
 *                   type: string
 *                   format: email
 *                 user_gender:
 *                   type: string
 *                 user_age:
 *                   type: integer
 *                 user_degree:
 *                   type: string
 *                 user_zipcode:
 *                   type: string
 *       400:
 *         description: Bad request, validation failed
 *       401:
 *         description: Unauthorized, invalid or missing token
 */
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
