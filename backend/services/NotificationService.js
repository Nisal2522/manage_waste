import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Email configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Twilio configuration
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Email notification service
export const sendEmail = async (to, subject, html, text = null) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@wastemanage.com',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const result = await emailTransporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// SMS notification service
export const sendSMS = async (to, message) => {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });

    console.log('SMS sent successfully:', result.sid);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.error('SMS sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Notification templates
export const NotificationTemplates = {
  // User registration
  userRegistration: (user) => ({
    subject: 'Welcome to Waste Management System',
    html: `
      <h2>Welcome ${user.name}!</h2>
      <p>Your account has been successfully created.</p>
      <p><strong>Role:</strong> ${user.role}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p>You can now access the system with your credentials.</p>
      <p>Thank you for joining our waste management platform!</p>
    `
  }),

  // Device linked
  deviceLinked: (user, device) => ({
    subject: 'Device Successfully Linked',
    html: `
      <h2>Device Linked Successfully</h2>
      <p>Hello ${user.name},</p>
      <p>Your device has been successfully linked to your account.</p>
      <p><strong>Device ID:</strong> ${device.deviceId}</p>
      <p><strong>Bin ID:</strong> ${device.binId}</p>
      <p><strong>Type:</strong> ${device.type}</p>
      <p>You can now track your waste collection through this device.</p>
    `
  }),

  // Collection recorded
  collectionRecorded: (user, collection) => ({
    subject: 'Waste Collection Recorded',
    html: `
      <h2>Collection Successfully Recorded</h2>
      <p>Hello ${user.name},</p>
      <p>Your waste collection has been recorded.</p>
      <p><strong>Weight:</strong> ${collection.weightKg} kg</p>
      <p><strong>Type:</strong> ${collection.collectionType}</p>
      <p><strong>Date:</strong> ${new Date(collection.timestamp).toLocaleString()}</p>
      <p>Thank you for your contribution to waste management!</p>
    `
  }),

  // Payment processed
  paymentProcessed: (user, payment) => ({
    subject: 'Payment Processed Successfully',
    html: `
      <h2>Payment Processed</h2>
      <p>Hello ${user.name},</p>
      <p>Your payment has been successfully processed.</p>
      <p><strong>Amount:</strong> $${payment.amount.toFixed(2)}</p>
      <p><strong>Method:</strong> ${payment.method}</p>
      <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
      <p><strong>Date:</strong> ${new Date(payment.date).toLocaleString()}</p>
      <p>Your account balance has been updated.</p>
    `
  }),

  // Invoice generated
  invoiceGenerated: (user, invoice) => ({
    subject: 'New Invoice Generated',
    html: `
      <h2>New Invoice Available</h2>
      <p>Hello ${user.name},</p>
      <p>A new invoice has been generated for your account.</p>
      <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
      <p><strong>Amount:</strong> $${invoice.totalAmount.toFixed(2)}</p>
      <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
      <p>Please log in to view and pay your invoice.</p>
    `
  }),

  // Route assigned
  routeAssigned: (user, route) => ({
    subject: 'New Route Assigned',
    html: `
      <h2>Route Assignment</h2>
      <p>Hello ${user.name},</p>
      <p>A new route has been assigned to you.</p>
      <p><strong>Route Name:</strong> ${route.name}</p>
      <p><strong>Truck ID:</strong> ${route.truckId}</p>
      <p><strong>Scheduled Date:</strong> ${new Date(route.scheduledDate).toLocaleDateString()}</p>
      <p><strong>Total Stops:</strong> ${route.totalStops}</p>
      <p>Please review the route details in your dashboard.</p>
    `
  }),

  // System alert
  systemAlert: (title, message, severity = 'medium') => ({
    subject: `System Alert: ${title}`,
    html: `
      <h2 style="color: ${severity === 'high' ? 'red' : severity === 'medium' ? 'orange' : 'green'}">${title}</h2>
      <p>${message}</p>
      <p><strong>Severity:</strong> ${severity.toUpperCase()}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    `
  })
};

// Send notification based on type
export const sendNotification = async (type, user, data, options = {}) => {
  try {
    const template = NotificationTemplates[type];
    if (!template) {
      throw new Error(`Notification template '${type}' not found`);
    }

    const notification = template(data);
    const results = {};

    // Send email if user has email
    if (user.email && !options.skipEmail) {
      const emailResult = await sendEmail(
        user.email,
        notification.subject,
        notification.html
      );
      results.email = emailResult;
    }

    // Send SMS if user has phone and SMS is enabled
    if (user.phone && options.sendSMS) {
      const smsMessage = notification.html.replace(/<[^>]*>/g, ''); // Strip HTML
      const smsResult = await sendSMS(user.phone, smsMessage);
      results.sms = smsResult;
    }

    return { success: true, results };
  } catch (error) {
    console.error('Notification sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Bulk notification service
export const sendBulkNotification = async (users, type, data, options = {}) => {
  const results = [];
  
  for (const user of users) {
    try {
      const result = await sendNotification(type, user, data, options);
      results.push({ user: user._id, result });
    } catch (error) {
      results.push({ user: user._id, error: error.message });
    }
  }

  return results;
};