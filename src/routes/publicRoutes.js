const express = require('express');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const TableReservation = require('../models/TableReservation');
const Message = require('../models/Message');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { generateBookingReceipt } = require('../services/pdfService');
const { sendBookingReceipt } = require('../services/mailService');
const { getContent } = require('../services/contentService');

const router = express.Router();

const defaultMenu = [
  { title: 'Ceylon Spiced Lobster', description: 'Butter-poached lobster with kandyan spice reduction.', price: 32, image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Tea Smoked Chicken', description: 'Organic chicken infused with highland tea leaves.', price: 22, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Jackfruit Risotto', description: 'Creamy saffron risotto with charred jackfruit.', price: 18, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop' }
];

router.get('/', async (req, res) => {
  const featuredRooms = await Room.find({ featured: true }).limit(3);
  const testimonials = await getContent('testimonials', [
    { name: 'Ananya Perera', text: 'An unforgettable escape in the hills. Service was impeccable.' },
    { name: 'James Cole', text: 'Elegant interiors, world-class dining, and serene views.' }
  ]);
  const offers = await getContent('offers', [
    { title: 'Romantic Highland Escape', details: 'Stay 3 nights and enjoy a complimentary candlelit dinner.' },
    { title: 'Family Safari Package', details: 'Bundle with Pinnawala day trip and 20% off second room.' }
  ]);

  res.render('pages/home', { featuredRooms, testimonials, offers });
});

router.get('/rooms', async (req, res) => {
  const { type, maxPrice, available } = req.query;
  const query = {};
  if (type) query.type = type;
  if (maxPrice) query.price = { $lte: Number(maxPrice) };
  if (available === 'true') query.available = true;

  const rooms = await Room.find(query).sort({ price: 1 });
  const types = await Room.distinct('type');
  res.render('pages/rooms', { rooms, types, filters: req.query });
});

router.get('/dining', async (req, res) => {
  const menu = await getContent('menu', defaultMenu);
  res.render('pages/dining', { menu });
});

router.get('/gallery', async (req, res) => {
  const galleryImages = await getContent('gallery', [
    'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop'
  ]);
  res.render('pages/gallery', { galleryImages });
});

router.get('/contact', async (_req, res) => {
  res.render('pages/contact');
});

router.post('/bookings', async (req, res) => {
  const { customerName, email, phone, checkIn, checkOut, roomType, specialRequests } = req.body;
  const room = await Room.findOne({ name: roomType });
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24)));
  const totalAmount = nights * (room ? room.price : 180);

  const booking = await Booking.create({
    customerName,
    email,
    phone,
    checkIn: inDate,
    checkOut: outDate,
    roomType,
    specialRequests,
    nights,
    totalAmount
  });

  const receiptPath = generateBookingReceipt(booking);
  booking.receiptPath = receiptPath;
  await booking.save();

  await sendBookingReceipt(booking, receiptPath ? `public${receiptPath}` : null);
  res.redirect(`/booking-success?id=${booking._id}`);
});

router.get('/booking-success', async (req, res) => {
  const booking = await Booking.findById(req.query.id);
  res.render('pages/booking-success', { booking });
});

router.post('/dining/table-booking', async (req, res) => {
  await TableReservation.create(req.body);
  res.redirect('/dining?reserved=true');
});

router.post('/contact', async (req, res) => {
  await Message.create(req.body);
  res.redirect('/contact?sent=true');
});

router.post('/newsletter', async (req, res) => {
  const { email } = req.body;
  if (email) {
    await NewsletterSubscriber.findOneAndUpdate({ email }, { email }, { upsert: true });
  }
  res.redirect(req.get('referer') || '/');
});

module.exports = router;
