const express = require('express');
const { body } = require('express-validator');
const { signup, login, updateProfile } = require('../controllers/authController');
const { validate } = require('../middleware/validateMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const updateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

router.post('/signup', signupValidation, validate, signup);
router.post('/login', loginValidation, validate, login);
router.put('/profile', authMiddleware, updateValidation, validate, updateProfile);

module.exports = router;
