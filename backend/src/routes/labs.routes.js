const { Router } = require('express');
const { getAllLabs, getLabById, createLab, updateLab, deleteLab } = require('../controllers/labs.controller');
const { authMiddleware } = require('../util/authMiddleware');

const router = Router();

router.get('/get', authMiddleware('student'), getAllLabs);
router.get('/get/:id', authMiddleware('student'), getLabById);
router.post('/create', authMiddleware('admin'), createLab);
router.put('/update/:id', authMiddleware('admin'), updateLab);
router.delete('/delete/:id', authMiddleware('admin'), deleteLab);

module.exports = router;
const { Router } = require('express');
const { getAllLabs, getLabById, createLab, updateLab, deleteLab } = require('../controllers/labs.controller');
const { authMiddleware } = require('../util/authMiddleware');

/**
 * @swagger
 * /labs/get:
 *   get:
 *     summary: Retrieve all labs
 *     tags: [Labs]
 *     security:
 *       - studentAuth: []
 *     responses:
 *       200:
 *         description: A list of labs
 *       401:
 *         description: Unauthorized
 */
router.get('/get', authMiddleware('student'), getAllLabs);

/**
 * @swagger
 * /labs/get/{id}:
 *   get:
 *     summary: Retrieve a lab by ID
 *     tags: [Labs]
 *     security:
 *       - studentAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The lab ID
 *     responses:
 *       200:
 *         description: A lab object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lab not found
 */
router.get('/get/:id', authMiddleware('student'), getLabById);

/**
 * @swagger
 * /labs/create:
 *   post:
 *     summary: Create a new lab
 *     tags: [Labs]
 *     security:
 *       - adminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lab created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.post('/create', authMiddleware('admin'), createLab);

/**
 * @swagger
 * /labs/update/{id}:
 *   put:
 *     summary: Update a lab by ID
 *     tags: [Labs]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The lab ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lab updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lab not found
 */
router.put('/update/:id', authMiddleware('admin'), updateLab);

/**
 * @swagger
 * /labs/delete/{id}:
 *   delete:
 *     summary: Delete a lab by ID
 *     tags: [Labs]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The lab ID
 *     responses:
 *       200:
 *         description: Lab deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lab not found
 */
router.delete('/delete/:id', authMiddleware('admin'), deleteLab);

module.exports = router;
