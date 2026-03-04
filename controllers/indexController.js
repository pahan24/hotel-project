const Room = require('../models/Room');
const Offer = require('../models/Offer');
const Event = require('../models/Event');

const renderHome = async (req, res) => {
    try {
        const featuredRooms = await Room.find({ featured: true, isAvailable: true }).limit(3);
        const activeOffers = await Offer.find({ isActive: true }).limit(3);
        res.render('pages/index', { title: 'Home', featuredRooms, activeOffers });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const renderStay = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true }).sort({ basePrice: 1 });
        res.render('pages/stay', { title: 'Our Rooms & Suites', rooms });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const renderBookingPage = async (req, res) => {
    try {
        const room = await Room.findById(req.params.roomId);
        if (!room) {
            return res.status(404).render('pages/404', { title: 'Room Not Found' });
        }
        res.render('pages/book', { title: `Book ${room.name}`, room });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const renderDine = (req, res) => {
    res.render('pages/dine', { title: 'Fine Dining' });
};

const renderHistory = (req, res) => {
    res.render('pages/history', { title: 'Our Heritage & History' });
};

const renderContact = (req, res) => {
    res.render('pages/contact', { title: 'Contact Us', success: req.query.success });
};

const renderEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.render('pages/events', { title: 'Events & Gatherings', events });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const renderOffers = async (req, res) => {
    try {
        const offers = await Offer.find({ isActive: true }).sort({ validUntil: 1 });
        res.render('pages/offers', { title: 'Exclusive Offers', offers });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const renderExperiences = (req, res) => {
    res.render('pages/experiences', { title: 'Spa & Experiences' });
};

module.exports = {
    renderHome,
    renderStay,
    renderBookingPage,
    renderDine,
    renderHistory,
    renderContact,
    renderEvents,
    renderOffers,
    renderExperiences
};
