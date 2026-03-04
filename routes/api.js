const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Open API Routes
router.post('/contact', apiController.submitContact);

// Booking Endpoint
router.post('/bookings/process', apiController.processBooking);

module.exports = router;
