const express = require('express');
const { body } = require('express-validator');
const { getMedicines, addMedicine, updateMedicine, deleteMedicine, getTodayMedicines } = require('../controllers/medicineController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const router = express.Router();

router.use(authMiddleware);

const medicineValidation = [
  body('name').trim().notEmpty().withMessage('Medicine name is required'),
  body('dosage').trim().notEmpty().withMessage('Dosage is required'),
  body('dosageTimes').isArray({ min: 1 }).withMessage('At least one dosage time is required'),
  body('dosageTimes.*.time').notEmpty().withMessage('Time is required for dosage'),
  body('dosageTimes.*.label').notEmpty().withMessage('Label is required for dosage (e.g., Before Breakfast)'),
];

router.get('/', getMedicines);
router.get('/today', getTodayMedicines);
router.post('/', medicineValidation, validate, addMedicine);
router.put('/:id', medicineValidation, validate, updateMedicine);
router.delete('/:id', deleteMedicine);

module.exports = router;
