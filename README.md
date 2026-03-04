# The Grove Kandy — Luxury Hotel Website

A complete, production-ready hotel website and booking platform for **The Grove Kandy** (Sri Lanka), designed with an elegant luxury aesthetic inspired by modern resort websites.

## Features Implemented

- Multi-page website: Home, Rooms & Suites, Dining, Gallery, Contact.
- Responsive design with TailwindCSS (desktop/tablet/mobile).
- Smooth scrolling + lightweight animations.
- Room listing with filter/sort by type, max price, and availability.
- Online room booking flow with:
  - Name, email, phone, check-in/check-out, room type, special requests.
  - Automated PDF receipt generation.
  - Email receipt delivery via SMTP (Nodemailer).
- Restaurant menu display + table reservation form.
- Click-to-open gallery lightbox.
- Contact form + embedded Google Map.
- Newsletter subscription.
- Admin panel:
  - Username/password login.
  - Manage bookings (view/update status/delete).
  - Manage rooms (add/edit/delete/update availability).
  - Manage dynamic homepage/menu/gallery content.
- SEO meta tags + Hotel structured data (JSON-LD).
- Payment gateway ready architecture (Stripe/PayPal can be integrated in booking route).

## Tech Stack

- **Frontend**: EJS templates + TailwindCSS + Vanilla JS
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Email**: SMTP via Nodemailer
- **Receipt PDFs**: PDFKit

## Setup

```bash
npm install
cp .env.example .env
# update .env values
npm run seed
npm run dev
```

Open: `http://localhost:3000`

## Admin Access

Default seed credentials:

- Username: `admin`
- Password: `admin123`

Login at: `http://localhost:3000/admin/login`

## Content & Pricing Customization Guide

### 1) Room prices, photos, facilities, availability

Go to **Admin → Manage Rooms**:
- Add new room
- Edit room details (price, type, image URL, facilities, availability)
- Delete room

### 2) Homepage promotions, testimonials, dining menu, gallery images

Go to **Admin → Manage Content** and edit JSON blocks:
- `offers`
- `testimonials`
- `menu`
- `gallery`

Use valid JSON array format.

### 3) Booking settings

- Booking amount is computed in `src/routes/publicRoutes.js` based on room rate x nights.
- Update pricing logic, taxes, discounts, or coupons there.

### 4) Email receipts

Set SMTP values in `.env`:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

The system automatically emails each booking receipt PDF to the customer.

### 5) Downloadable PDF receipts

Generated files are stored under `public/receipts/` and linked on booking success page + admin booking list.

### 6) Optional payment integration (Stripe/PayPal)

Add payment session creation in `POST /bookings` route before saving booking:
- Collect payment.
- On success, persist booking and send receipt.

## Deployment Notes

- Use a managed MongoDB (MongoDB Atlas) in production.
- Set strong `SESSION_SECRET` and production SMTP credentials.
- Add HTTPS and reverse proxy (Nginx/Caddy).
- Compress images and place local assets/CDN for best performance.

