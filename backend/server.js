require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const productRoutes = require('./routes/productRoutes');

// Import models
const Medicine = require('./models/Medicine');
const Appointment = require('./models/Appointment');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5050;

// Trust proxy for Render/Cloud environments (needed for rate limiting)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Pinged your deployment. You successfully connected to MongoDB!'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/products', productRoutes);

// Notification System - Check every minute
cron.schedule('* * * * *', async () => {
  try {
    await checkMedicineReminders();
    await checkExpiryAlerts();
    await checkAppointmentReminders();
  } catch (error) {
    console.error('Error in notification system:', error);
  }
});

// Daily status reset - Midnight
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Resetting medicine status for the new day...');
    await Medicine.updateMany(
      { repeat: true },
      { status: 'Pending' }
    );
    console.log('Medicine status reset complete.');
  } catch (error) {
    console.error('Error resetting medicine status:', error);
  }
});

// Check medicine reminders
async function checkMedicineReminders() {
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  const medicines = await Medicine.find({ 
    repeat: true,
    'dosageTimes.time': currentTime 
  }).populate('userId', 'name email');

  medicines.forEach(medicine => {
    console.log(`Medicine reminder for ${medicine.userId.name}: ${medicine.name} at ${currentTime}`);
  });
}

// Check expiry alerts and update statuses
async function checkExpiryAlerts() {
  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  // Update statuses in DB
  await Product.updateMany(
    { expiryDate: { $lt: now }, status: { $ne: 'Expired' } },
    { status: 'Expired' }
  );
  
  await Product.updateMany(
    { 
      expiryDate: { $gte: now, $lte: threeDaysFromNow }, 
      status: { $ne: 'Expiring Soon' } 
    },
    { status: 'Expiring Soon' }
  );

  const expiringProducts = await Product.find({
    expiryDate: { $lte: threeDaysFromNow },
    status: { $in: ['Active', 'Expiring Soon'] }
  }).populate('userId', 'name email');

  expiringProducts.forEach(product => {
    console.log(`Expiry alert for ${product.userId.name}: ${product.name} expires on ${product.expiryDate}`);
  });
}

// Check appointment reminders
async function checkAppointmentReminders() {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const appointments = await Appointment.find({
    date: { $lte: threeDaysFromNow, $gte: now },
    status: 'Upcoming'
  }).populate('userId', 'name email');

  appointments.forEach(appointment => {
    console.log(`Appointment reminder for ${appointment.userId.name}: Dr. ${appointment.doctorName} on ${appointment.date}`);
  });
}

// Monthly doctor reminder - Check daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  try {
    await createMonthlyReminders();
  } catch (error) {
    console.error('Error creating monthly reminders:', error);
  }
});

async function createMonthlyReminders() {
  console.log('Monthly doctor reminders checked');
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*path', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
