require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB().catch((error) => {
  console.error('DB connection failed', error);
  process.exit(1);
});

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'the-grove-kandy-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/the-grove-kandy'
    })
  })
);

app.use((req, res, next) => {
  res.locals.site = {
    name: 'The Grove Kandy',
    phone: '+94 81 223 7788',
    email: 'reservations@thegrovekandy.com'
  };
  res.locals.adminLogged = Boolean(req.session.adminId);
  res.locals.currentPath = req.path;
  next();
});

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`The Grove Kandy running on http://localhost:${PORT}`);
});
