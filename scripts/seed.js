require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../src/config/db');
const Room = require('../src/models/Room');
const Admin = require('../src/models/Admin');

async function seed() {
  await connectDB();

  await Room.deleteMany({});
  await Room.insertMany([
    {
      name: 'Garden Deluxe Room',
      slug: 'garden-deluxe-room',
      type: 'Deluxe',
      price: 210,
      capacity: 2,
      size: '40 sqm',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop',
      description: 'Spacious room with private balcony overlooking tropical gardens.',
      facilities: ['King bed', 'Rain shower', 'Tea bar', 'High-speed WiFi'],
      featured: true,
      available: true
    },
    {
      name: 'Highland Suite',
      slug: 'highland-suite',
      type: 'Suite',
      price: 340,
      capacity: 3,
      size: '68 sqm',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop',
      description: 'Luxury suite with living area and panoramic mountain views.',
      facilities: ['Living room', 'Butler service', 'Jacuzzi', 'Espresso station'],
      featured: true,
      available: true
    },
    {
      name: 'Royal Family Residence',
      slug: 'royal-family-residence',
      type: 'Family',
      price: 460,
      capacity: 5,
      size: '92 sqm',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
      description: 'Two-bedroom residence designed for stylish family escapes.',
      facilities: ['2 Bedrooms', 'Dining corner', 'Private terrace', 'Smart TV'],
      featured: true,
      available: true
    }
  ]);

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.findOneAndUpdate({ username }, { username, passwordHash }, { upsert: true });

  console.log('Seed complete. Admin:', username);
  process.exit(0);
}

seed();
