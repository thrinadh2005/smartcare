const express = require('express');
const { getAppointments, addAppointment, updateAppointment, deleteAppointment, getUpcomingAppointments } = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', getAppointments);
router.get('/upcoming', getUpcomingAppointments);
router.post('/', addAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
