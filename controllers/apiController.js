const Message = require('../models/Message');

const submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        await Message.create({
            name,
            email,
            phone,
            subject: subject || 'General Inquiry',
            message
        });

        // Redirect back with success flag
        res.redirect('/contact?success=true');
    } catch (err) {
        console.error('Error submitting contact form:', err);
        res.status(500).send('Server Error');
    }
};

const Booking = require('../models/Booking');
const Room = require('../models/Room');
const pdfGenerator = require('../utils/pdfGenerator');
const mailer = require('../utils/mailer');

const processBooking = async (req, res) => {
    try {
        const { roomId, roomPrice, customerName, customerEmail, customerPhone, guests, checkInDate, checkOutDate, specialRequests } = req.body;

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const diffDays = Math.ceil(Math.abs(checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = parseInt(roomPrice) * diffDays;

        // Save Booking
        const booking = await Booking.create({
            room: roomId,
            customerName,
            customerEmail,
            customerPhone,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            totalPrice,
            specialRequests,
            status: 'Pending'
        });

        const room = await Room.findById(roomId);

        // Generate PDF
        const bookingDetails = {
            customerName,
            customerEmail,
            customerPhone,
            status: 'Pending',
            roomName: room ? room.name : 'Unknown Room',
            checkInDate: checkIn.toDateString(),
            checkOutDate: checkOut.toDateString(),
            totalNights: diffDays,
            pricePerNight: roomPrice,
            totalPrice
        };

        const pdfBuffer = await pdfGenerator.generateBookingPDF(bookingDetails);

        // Send Email (We wrap in try-catch so the app doesn't crash if mail fails during dev)
        try {
            await mailer.sendBookingConfirmation(customerEmail, customerName, pdfBuffer);
        } catch (mailError) {
            console.error("Warning: Could not send email. Ensure Mailtrap is configured.", mailError);
        }

        // Render success response
        res.render('pages/booking-success', { title: 'Booking Received' });

    } catch (err) {
        console.error('Error processing booking:', err);
        res.status(500).send('Server Error Processing Booking');
    }
};

module.exports = {
    submitContact,
    processBooking
};
