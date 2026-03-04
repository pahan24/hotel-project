const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// Global Frontend Routes
router.get('/', indexController.renderHome);

// Stay and Booking Routes
router.get('/stay', indexController.renderStay);
router.get('/stay/book/:roomId', indexController.renderBookingPage);

// Other Frontend Pages
router.get('/dine', indexController.renderDine);
router.get('/history', indexController.renderHistory);
router.get('/contact', indexController.renderContact);
router.get('/events', indexController.renderEvents);
router.get('/offers', indexController.renderOffers);
router.get('/experiences', indexController.renderExperiences);

module.exports = router;
