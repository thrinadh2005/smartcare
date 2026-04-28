const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"SmartCare" <no-reply@smartcare.com>',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw error to avoid breaking the cron job, just log it
    return null;
  }
};

const sendMedicineReminder = async (userEmail, userName, medicineName, time) => {
  const subject = `Medicine Reminder: ${medicineName}`;
  const text = `Hello ${userName}, this is a reminder to take your medicine: ${medicineName} at ${time}.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0d9488; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">SmartCare</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Medicine Reminder</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>This is a friendly reminder to take your medicine:</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 18px; color: #0d9488;"><strong>${medicineName}</strong></p>
          <p style="margin: 5px 0 0 0; color: #64748b;">Scheduled Time: ${time}</p>
        </div>
        <p>Please stay healthy!</p>
      </div>
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
        © 2026 SmartCare. All rights reserved.
      </div>
    </div>
  `;
  return sendEmail(userEmail, subject, text, html);
};

const sendExpiryAlert = async (userEmail, userName, productName, expiryDate) => {
  const subject = `Expiry Alert: ${productName}`;
  const dateStr = new Date(expiryDate).toLocaleDateString();
  const text = `Hello ${userName}, your medicine ${productName} is expiring on ${dateStr}. Please replace it soon.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #e11d48; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">SmartCare Alert</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Medicine Expiring Soon</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>One of your stored medicines is reaching its expiration date:</p>
        <div style="background-color: #fff1f2; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #e11d48;">
          <p style="margin: 0; font-size: 18px; color: #9f1239;"><strong>${productName}</strong></p>
          <p style="margin: 5px 0 0 0; color: #be123c;">Expiry Date: ${dateStr}</p>
        </div>
        <p>Please consider replacing this medicine soon to ensure its effectiveness.</p>
      </div>
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
        © 2026 SmartCare. All rights reserved.
      </div>
    </div>
  `;
  return sendEmail(userEmail, subject, text, html);
};

const sendAppointmentReminder = async (userEmail, userName, doctorName, date, time) => {
  const subject = `Appointment Reminder: Dr. ${doctorName}`;
  const dateStr = new Date(date).toLocaleDateString();
  const text = `Hello ${userName}, you have an appointment with Dr. ${doctorName} on ${dateStr} at ${time}.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #16a34a; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">SmartCare</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Upcoming Appointment</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>You have an upcoming medical appointment:</p>
        <div style="background-color: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 18px; color: #16a34a;"><strong>Dr. ${doctorName}</strong></p>
          <p style="margin: 5px 0 0 0; color: #15803d;">Date: ${dateStr}</p>
          <p style="margin: 5px 0 0 0; color: #15803d;">Time: ${time}</p>
        </div>
        <p>Don't forget to carry your medical records!</p>
      </div>
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
        © 2026 SmartCare. All rights reserved.
      </div>
    </div>
  `;
  return sendEmail(userEmail, subject, text, html);
};

module.exports = {
  sendMedicineReminder,
  sendExpiryAlert,
  sendAppointmentReminder,
};
