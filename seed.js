const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('MongoDB connected for seeding script.');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@grovekandy.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        // Check if user exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists. Updating password if necessary... or you can just login with current credentials.');
            process.exit(0);
        }

        const adminUser = new User({
            username: 'Admin',
            email: adminEmail,
            password: adminPassword,
            role: 'Admin'
        });

        await adminUser.save();
        console.log(`Admin user created! Email: ${adminEmail}, Password: ${adminPassword}`);
        process.exit(0);
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });
