const express = require('express');
const { getProducts, addProduct, updateProduct, deleteProduct, getExpiringSoon, upload } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', getProducts);
router.get('/expiring-soon', getExpiringSoon);
router.post('/', upload.single('image'), addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
