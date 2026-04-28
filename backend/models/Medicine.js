const mongoose = require('mongoose');

const dosageTimeSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    enum: ['Early Morning (Before Tiffin)', 'After Tiffin', 'Before Lunch', 'After Lunch', 'Before Dinner', 'After Dinner']
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
  }
});

const medicineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosageTimes: [dosageTimeSchema],
  repeat: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['Taken', 'Missed', 'Pending'],
    default: 'Pending'
  },
  lastTaken: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
medicineSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);
