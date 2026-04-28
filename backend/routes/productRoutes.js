const express = require('express');
const { body } = require('express-validator');
const { getProducts, addProduct, updateProduct, deleteProduct, getExpiringSoon, upload } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const router = express.Router();

router.use(authMiddleware);

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
];

router.get('/', getProducts);
router.get('/expiring-soon', getExpiringSoon);
router.post('/', upload.single('image'), productValidation, validate, addProduct);
router.put('/:id', productValidation, validate, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
