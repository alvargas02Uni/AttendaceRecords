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

/**
 * @swagger
 * tags:
 *   name: Labs
 *   description: Laboratory management
 */

/**
 * @swagger
 * /labs/get:
 *   get:
 *     summary: Retrieve all laboratories
 *     tags: [Labs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of laboratories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   lab_name:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/get', authMiddleware('student'), getAllLabs);

/**
 * @swagger
 * /labs/get/{id}:
 *   get:
 *     summary: Retrieve a laboratory by ID
 *     tags: [Labs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Laboratory ID
 *     responses:
 *       200:
 *         description: Laboratory details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 lab_name:
 *                   type: string
 *       404:
 *         description: Laboratory not found
 *       401:
 *         description: Unauthorized
 */
router.get('/get/:id', authMiddleware('student'), [
  param('id').isInt().withMessage('ID must be an integer'),
], getLabById);

/**
 * @swagger
 * /labs/create:
 *   post:
 *     summary: Create a new laboratory
 *     tags: [Labs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lab_name
 *             properties:
 *               lab_name:
 *                 type: string
 *                 maxLength: 255
 *     responses:
 *       201:
 *         description: Laboratory created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/create', authMiddleware('admin'), [
  body('lab_name')
    .notEmpty()
    .withMessage('lab_name is required')
    .isLength({ max: 255 })
    .withMessage('lab_name exceeds maximum length'),
], createLab);

/**
 * @swagger
 * /labs/update/{id}:
 *   put:
 *     summary: Update a laboratory by ID
 *     tags: [Labs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Laboratory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lab_name
 *             properties:
 *               lab_name:
 *                 type: string
 *                 maxLength: 255
 *     responses:
 *       200:
 *         description: Laboratory updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Laboratory not found
 */
router.put('/update/:id', authMiddleware('admin'), [
  param('id').isInt().withMessage('ID must be an integer'),
  body('lab_name')
    .notEmpty()
    .withMessage('lab_name is required')
    .isLength({ max: 255 })
    .withMessage('lab_name exceeds maximum length'),
], updateLab);

/**
 * @swagger
 * /labs/delete/{id}:
 *   delete:
 *     summary: Delete a laboratory by ID
 *     tags: [Labs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Laboratory ID
 *     responses:
 *       200:
 *         description: Laboratory deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Laboratory not found
 */
router.delete('/delete/:id', authMiddleware('admin'), [
  param('id').isInt().withMessage('ID must be an integer'),
], deleteLab);

module.exports = router;
