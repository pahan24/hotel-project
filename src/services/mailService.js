const nodemailer = require('nodemailer');

function createTransporter() {
  if (!process.env.SMTP_HOST) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendBookingReceipt(booking, receiptPath) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('SMTP not configured. Skipping email for booking', booking._id);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'reservations@thegrovekandy.com',
    to: booking.email,
    subject: 'Your Booking Receipt - The Grove Kandy',
    html: `
      <h2>Thank you for booking with The Grove Kandy</h2>
      <p><strong>Name:</strong> ${booking.customerName}</p>
      <p><strong>Room:</strong> ${booking.roomType}</p>
      <p><strong>Dates:</strong> ${new Date(booking.checkIn).toDateString()} - ${new Date(booking.checkOut).toDateString()}</p>
      <p><strong>Total:</strong> USD ${booking.totalAmount}</p>
      <p>We look forward to welcoming you.</p>
    `,
    attachments: receiptPath
      ? [
          {
            filename: 'booking-receipt.pdf',
            path: receiptPath
          }
        ]
      : []
  });
}

module.exports = { sendBookingReceipt };
