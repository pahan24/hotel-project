const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const connectDB = require('./utils/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Setup Global variables for views
app.use((req, res, next) => {
    res.locals.admin = req.session.admin || null;
    res.locals.currentPath = req.path;
    next();
});

// Import Routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

// Use Routes
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
