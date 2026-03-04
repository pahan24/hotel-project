const Booking = require('../models/Booking');
const Message = require('../models/Message');

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('room').sort({ createdAt: -1 });
        res.render('pages/admin/bookings/index', { title: 'Manage Bookings', bookings });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        await Booking.findByIdAndUpdate(req.params.id, { status });

        // FUTURE ENHANCEMENT: Send email logic here when status changes to "Confirmed" or "Cancelled"

        res.redirect('/admin/bookings');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.render('pages/admin/messages/index', { title: 'Customer Messages', messages });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const markMessageRead = async (req, res) => {
    try {
        await Message.findByIdAndUpdate(req.params.id, { isRead: true });
        res.redirect('/admin/messages');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = { getBookings, updateBookingStatus, getMessages, markMessageRead };
