const Appointment = require('../models/Appointment');

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id }).sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addAppointment = async (req, res) => {
  try {
    const { doctorName, date, time, reminderDaysBefore, notes, isMonthlyReminder } = req.body;
    
    const appointment = new Appointment({
      userId: req.user._id,
      doctorName,
      date,
      time,
      reminderDaysBefore,
      notes,
      isMonthlyReminder
    });

    // If it's a monthly reminder, set the next reminder date
    if (isMonthlyReminder) {
      const nextDate = new Date(date);
      nextDate.setMonth(nextDate.getMonth() + 1);
      appointment.nextReminderDate = nextDate;
    }

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorName, date, time, reminderDaysBefore, notes, status } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { doctorName, date, time, reminderDaysBefore, notes, status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUpcomingAppointments = async (req, res) => {
  try {
    const now = new Date();
    const appointments = await Appointment.find({ 
      userId: req.user._id,
      date: { $gte: now },
      status: 'Upcoming'
    }).sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  getUpcomingAppointments
};
