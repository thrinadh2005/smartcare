const express = require('express');
const { body } = require('express-validator');
const { getAppointments, addAppointment, updateAppointment, deleteAppointment, getUpcomingAppointments } = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const router = express.Router();

router.use(authMiddleware);

const appointmentValidation = [
  body('doctorName').trim().notEmpty().withMessage('Doctor name is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('reason').optional().trim(),
];

router.get('/', getAppointments);
router.get('/upcoming', getUpcomingAppointments);
router.post('/', appointmentValidation, validate, addAppointment);
router.put('/:id', appointmentValidation, validate, updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
