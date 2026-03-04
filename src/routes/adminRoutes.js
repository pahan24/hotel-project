const express = require('express');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const Admin = require('../models/Admin');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const TableReservation = require('../models/TableReservation');
const Message = require('../models/Message');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { ensureAdmin } = require('../middleware/auth');
const { getContent, setContent } = require('../services/contentService');

const router = express.Router();

router.get('/login', (_req, res) => res.render('admin/login', { error: null }));

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.render('admin/login', { error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return res.render('admin/login', { error: 'Invalid credentials' });

  req.session.adminId = admin._id;
  return res.redirect('/admin/dashboard');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

router.get('/dashboard', ensureAdmin, async (_req, res) => {
  const [bookings, rooms, tables, messages, subscribers] = await Promise.all([
    Booking.find().sort({ createdAt: -1 }).limit(8),
    Room.find(),
    TableReservation.find().sort({ createdAt: -1 }).limit(5),
    Message.find().sort({ createdAt: -1 }).limit(5),
    NewsletterSubscriber.countDocuments()
  ]);

  res.render('admin/dashboard', { bookings, rooms, tables, messages, subscribers });
});

router.get('/bookings', ensureAdmin, async (_req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.render('admin/bookings', { bookings });
});

router.post('/bookings/:id/status', ensureAdmin, async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.redirect('/admin/bookings');
});

router.post('/bookings/:id/delete', ensureAdmin, async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.redirect('/admin/bookings');
});

router.get('/rooms', ensureAdmin, async (_req, res) => {
  const rooms = await Room.find().sort({ createdAt: -1 });
  res.render('admin/rooms', { rooms });
});

router.post('/rooms', ensureAdmin, async (req, res) => {
  const payload = {
    ...req.body,
    slug: slugify(req.body.name, { lower: true, strict: true }),
    facilities: req.body.facilities.split(',').map((item) => item.trim())
  };
  payload.featured = req.body.featured === 'on';
  payload.available = req.body.available === 'on';
  await Room.create(payload);
  res.redirect('/admin/rooms');
});

router.post('/rooms/:id/update', ensureAdmin, async (req, res) => {
  const payload = {
    ...req.body,
    facilities: req.body.facilities.split(',').map((item) => item.trim()),
    featured: req.body.featured === 'on',
    available: req.body.available === 'on'
  };
  await Room.findByIdAndUpdate(req.params.id, payload);
  res.redirect('/admin/rooms');
});

router.post('/rooms/:id/delete', ensureAdmin, async (req, res) => {
  await Room.findByIdAndDelete(req.params.id);
  res.redirect('/admin/rooms');
});

router.get('/content', ensureAdmin, async (_req, res) => {
  const [offers, testimonials, menu, gallery] = await Promise.all([
    getContent('offers', []),
    getContent('testimonials', []),
    getContent('menu', []),
    getContent('gallery', [])
  ]);
  res.render('admin/content', { offers, testimonials, menu, gallery });
});

router.post('/content', ensureAdmin, async (req, res) => {
  const safeParse = (raw) => {
    try {
      return JSON.parse(raw);
    } catch (_error) {
      return [];
    }
  };

  await Promise.all([
    setContent('offers', safeParse(req.body.offers)),
    setContent('testimonials', safeParse(req.body.testimonials)),
    setContent('menu', safeParse(req.body.menu)),
    setContent('gallery', safeParse(req.body.gallery))
  ]);

  res.redirect('/admin/content?updated=true');
});

module.exports = router;
