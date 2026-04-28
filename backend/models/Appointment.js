const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorName: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/i.test(v);
      },
      message: 'Time must be in format HH:MM AM/PM'
    }
  },
  reminderDaysBefore: {
    type: Number,
    default: 3,
    min: 1,
    max: 7
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  isMonthlyReminder: {
    type: Boolean,
    default: false
  },
  nextReminderDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ userId: 1, date: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
