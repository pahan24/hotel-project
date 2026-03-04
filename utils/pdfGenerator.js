const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a PDF receipt/booking confirmation as a buffer.
 * @param {Object} bookingDetails - The booking information.
 * @returns {Promise<Buffer>} - Resolves with the PDF buffer.
 */
const generateBookingPDF = (bookingDetails) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            let buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // --- PDF Layout & Styling ---

            // Header Background
            doc.rect(0, 0, doc.page.width, 100).fill('#1a1a1a');

            // Logo / Title (White text on dark bg)
            doc.fillColor('#ffffff').fontSize(24).font('Times-Roman').text('The Grove Kandy', 50, 30);
            doc.fillColor('#c5a365').fontSize(12).text('Heritage Opulence', 50, 60);

            // Receipt Title
            doc.fillColor('#1a1a1a').fontSize(20).text('Booking Confirmation', 50, 130);

            // Booking Details Grid
            const startY = 170;
            const leftX = 50;
            const rightX = 300;

            doc.fontSize(12).font('Helvetica-Bold').text('Customer Name:', leftX, startY);
            doc.font('Helvetica').text(bookingDetails.customerName, leftX + 110, startY);

            doc.font('Helvetica-Bold').text('Email Address:', leftX, startY + 20);
            doc.font('Helvetica').text(bookingDetails.customerEmail, leftX + 110, startY + 20);

            doc.font('Helvetica-Bold').text('Phone:', leftX, startY + 40);
            doc.font('Helvetica').text(bookingDetails.customerPhone, leftX + 110, startY + 40);

            doc.font('Helvetica-Bold').text('Booking Status:', leftX, startY + 60);
            doc.font('Helvetica').fillColor('#c5a365').text(bookingDetails.status, leftX + 110, startY + 60);

            // Stay Details
            doc.fillColor('#1a1a1a').font('Helvetica-Bold').text('Room / Suite:', rightX, startY);
            doc.font('Helvetica').text(bookingDetails.roomName, rightX + 110, startY);

            doc.font('Helvetica-Bold').text('Check-In:', rightX, startY + 20);
            doc.font('Helvetica').text(bookingDetails.checkInDate, rightX + 110, startY + 20);

            doc.font('Helvetica-Bold').text('Check-Out:', rightX, startY + 40);
            doc.font('Helvetica').text(bookingDetails.checkOutDate, rightX + 40, startY + 40); // Need offset adjustment?
            // Re-adjust alignment
            doc.text(bookingDetails.checkOutDate, rightX + 110, startY + 40);

            // Cost Summary Table
            const tableTop = 290;
            doc.rect(50, tableTop, 500, 2).fill('#c5a365');

            doc.fillColor('#1a1a1a').font('Helvetica-Bold').text('Description', 60, tableTop + 10);
            doc.text('Amount', 450, tableTop + 10, { width: 90, align: 'right' });

            doc.rect(50, tableTop + 30, 500, 1).fill('#eaeaea');

            doc.font('Helvetica').fillColor('#333333');
            doc.text(`${bookingDetails.roomName} (${bookingDetails.totalNights} nights x $${bookingDetails.pricePerNight})`, 60, tableTop + 45);
            doc.text(`$${bookingDetails.totalPrice.toFixed(2)}`, 450, tableTop + 45, { width: 90, align: 'right' });

            doc.rect(50, tableTop + 70, 500, 2).fill('#c5a365');

            doc.fillColor('#1a1a1a').font('Helvetica-Bold').fontSize(14).text('Total Paid:', 60, tableTop + 85);
            doc.fontSize(14).text(`$0.00 (Pending)`, 400, tableTop + 85, { width: 140, align: 'right' });

            // Footer Warning
            doc.fontSize(10).font('Helvetica-Oblique').fillColor('#777777')
                .text('Payment will be collected at the property. This document serves as a reservation request and is subject to final confirmation by the hotel staff.', 50, 650, { width: 500, align: 'center' });

            doc.end();

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    generateBookingPDF
};
