const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
  expiryDate: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  category: {
    type: String,
    enum: ['Medicine'],
    default: 'Medicine'
  },
  status: {
    type: String,
    enum: ['Active', 'Expiring Soon', 'Expired'],
    default: 'Active'
  },
  ocrExtractedText: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
productSchema.index({ userId: 1, expiryDate: 1, status: 1 });

// Pre-save middleware to update status based on expiry date
productSchema.pre('save', function(next) {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  
  if (this.expiryDate < now) {
    this.status = 'Expired';
  } else if (this.expiryDate <= threeDaysFromNow) {
    this.status = 'Expiring Soon';
  } else {
    this.status = 'Active';
  }
  
  next();
});

module.exports = mongoose.model('Product', productSchema);
