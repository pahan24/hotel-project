const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends a booking confirmation email with attached PDF.
 * @param {string} toEmail - Customer email
 * @param {string} customerName - Customer Name
 * @param {Buffer} pdfBuffer - PDF Receipt buffer
 */
const sendBookingConfirmation = async (toEmail, customerName, pdfBuffer) => {
    try {
        const mailOptions = {
            from: `"The Grove Kandy" <${process.env.ADMIN_EMAIL}>`,
            to: toEmail,
            subject: 'Booking Request Received - The Grove Kandy',
            text: `Dear ${customerName},\n\nThank you for choosing to stay with us at The Grove Kandy. Your booking request has been received and is currently Pending.\n\nPlease find your booking summary attached as a PDF.\n\nWarm regards,\nThe Grove Kandy Team`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; padding: 20px;">
                    <h2 style="color: #c5a365;">The Grove Kandy</h2>
                    <p>Dear ${customerName},</p>
                    <p>Thank you for choosing to stay with us. Your booking request has been received and is currently <strong>Pending</strong>.</p>
                    <p>Our team will review your request and contact you shortly with the final confirmation and payment details.</p>
                    <p>Please find your booking summary attached to this email.</p>
                    <br>
                    <p style="font-size: 0.9em; color: #777;">Warm regards,<br>The Grove Kandy Reservations Team</p>
                </div>
            `,
            attachments: [
                {
                    filename: 'Booking_Receipt_TheGroveKandy.pdf',
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = {
    sendBookingConfirmation
};
