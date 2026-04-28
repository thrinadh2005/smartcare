const express = require('express');
const { getMedicines, addMedicine, updateMedicine, deleteMedicine, getTodayMedicines } = require('../controllers/medicineController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', getMedicines);
router.get('/today', getTodayMedicines);
router.post('/', addMedicine);
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);

module.exports = router;
