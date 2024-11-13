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
