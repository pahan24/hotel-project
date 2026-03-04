const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function generateBookingReceipt(booking) {
  const receiptsDir = path.join(process.cwd(), 'public', 'receipts');
  if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir, { recursive: true });
  }

  const filename = `receipt-${booking._id}.pdf`;
  const filePath = path.join(receiptsDir, filename);

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(24).text('The Grove Kandy', { align: 'center' });
  doc.moveDown();
  doc.fontSize(16).text('Booking Receipt');
  doc.moveDown();
  doc.fontSize(12).text(`Booking ID: ${booking._id}`);
  doc.text(`Guest: ${booking.customerName}`);
  doc.text(`Email: ${booking.email}`);
  doc.text(`Phone: ${booking.phone}`);
  doc.text(`Room: ${booking.roomType}`);
  doc.text(`Check-in: ${new Date(booking.checkIn).toDateString()}`);
  doc.text(`Check-out: ${new Date(booking.checkOut).toDateString()}`);
  doc.text(`Nights: ${booking.nights}`);
  doc.text(`Total Amount: USD ${booking.totalAmount}`);
  doc.text(`Status: ${booking.status}`);
  if (booking.specialRequests) {
    doc.moveDown().text(`Special Requests: ${booking.specialRequests}`);
  }

  doc.moveDown().text('Thank you for choosing The Grove Kandy.', { align: 'center' });
  doc.end();

  return `/receipts/${filename}`;
}

module.exports = { generateBookingReceipt };
