const Event = require('../models/Event');
const Offer = require('../models/Offer');
// Could reuse Event for Experience or create a new model. Let's use a simpler approach for Offers/Events right now.

const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.render('pages/admin/events/index', { title: 'Manage Events', events });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const showAddEvent = (req, res) => {
    res.render('pages/admin/events/add', { title: 'Add Event' });
};

const addEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, allowRegistration } = req.body;

        const newEvent = new Event({
            title,
            description,
            date,
            time,
            location,
            allowRegistration: allowRegistration === 'on',
            image: '/images/events/placeholder.jpg'
        });

        await newEvent.save();
        res.redirect('/admin/events');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.redirect('/admin/events');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const getOffers = async (req, res) => {
    try {
        const offers = await Offer.find().sort({ validUntil: 1 });
        res.render('pages/admin/offers/index', { title: 'Manage Offers', offers });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const showAddOffer = (req, res) => {
    res.render('pages/admin/offers/add', { title: 'Add Offer' });
};

const addOffer = async (req, res) => {
    try {
        const { title, description, discountDetails, validUntil, isActive } = req.body;

        const newOffer = new Offer({
            title,
            description,
            discountDetails,
            validUntil,
            isActive: isActive === 'on',
            image: '/images/offers/placeholder.jpg'
        });

        await newOffer.save();
        res.redirect('/admin/offers');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const deleteOffer = async (req, res) => {
    try {
        await Offer.findByIdAndDelete(req.params.id);
        res.redirect('/admin/offers');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getEvents, showAddEvent, addEvent, deleteEvent,
    getOffers, showAddOffer, addOffer, deleteOffer
};
