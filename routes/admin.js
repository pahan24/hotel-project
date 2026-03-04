const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminRoomController = require('../controllers/adminRoomController');
const adminContentController = require('../controllers/adminContentController');
const adminSystemController = require('../controllers/adminSystemController');
const { isAdmin, redirectIfLoggedIn } = require('../middleware/auth');

// Auth Routes
router.get('/login', redirectIfLoggedIn, authController.showLogin);
router.post('/login', redirectIfLoggedIn, authController.login);
router.get('/logout', authController.logout);

// Dashboard Route (Protected)
router.get('/dashboard', isAdmin, (req, res) => {
    res.render('pages/admin/dashboard', { title: 'Dashboard' });
});

// Room Management Routes (Protected)
router.get('/rooms', isAdmin, adminRoomController.getRooms);
router.get('/rooms/add', isAdmin, adminRoomController.showAddRoom);
router.post('/rooms/add', isAdmin, adminRoomController.addRoom);
router.get('/rooms/edit/:id', isAdmin, adminRoomController.showEditRoom);
router.post('/rooms/edit/:id', isAdmin, adminRoomController.editRoom);
router.post('/rooms/delete/:id', isAdmin, adminRoomController.deleteRoom);

// Content Management Routes (Events)
router.get('/events', isAdmin, adminContentController.getEvents);
router.get('/events/add', isAdmin, adminContentController.showAddEvent);
router.post('/events/add', isAdmin, adminContentController.addEvent);
router.post('/events/delete/:id', isAdmin, adminContentController.deleteEvent);

// Content Management Routes (Offers)
router.get('/offers', isAdmin, adminContentController.getOffers);
router.get('/offers/add', isAdmin, adminContentController.showAddOffer);
router.post('/offers/add', isAdmin, adminContentController.addOffer);
router.post('/offers/delete/:id', isAdmin, adminContentController.deleteOffer);

// System Management Routes (Bookings & Messages)
router.get('/bookings', isAdmin, adminSystemController.getBookings);
router.post('/bookings/update/:id', isAdmin, adminSystemController.updateBookingStatus);

router.get('/messages', isAdmin, adminSystemController.getMessages);
router.post('/messages/read/:id', isAdmin, adminSystemController.markMessageRead);

module.exports = router;
