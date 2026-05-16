# Train Ticket Booking System 🚂

A full-stack web application for booking train tickets across 100+ Indian railway routes with real-time seat availability, secure payment gateway integration, and a comprehensive admin dashboard.

**Live Demo:** [https://train-booking-24bda70369-lgzn.vercel.app/](https://train-booking-24bda70369-lgzn.vercel.app/)

---

## ✨ Key Features

- 🔍 **Train Search:** Filter by route, date, departure time, and class
- 💺 **Real-time Availability:** Live seat availability across all routes
- 💳 **Payment Gateway:** Secure 3-step payment process with Razorpay integration
- 🎫 **Booking Management:** View, confirm, and cancel bookings
- 👤 **User Authentication:** JWT-based login & signup
- 📊 **Admin Panel:** Analytics, route management, booking monitoring
- 🗺️ **100+ Routes:** Pre-seeded Indian train routes with realistic data
- 📱 **Responsive Design:** Optimized for desktop and mobile

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 18, TypeScript |
| **Styling** | Tailwind CSS |
| **State Management** | Zustand |
| **HTTP Client** | Axios |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT (JSON Web Tokens) |
| **Payment** | Razorpay (Payment Gateway) |
| **Deployment** | Vercel |
| **Version Control** | Git, GitHub |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ and npm/pnpm
- MongoDB Atlas account (free tier works)
- Razorpay sandbox account for testing
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/thehimanshugoyl/train-booking-24bda70369.git
cd train-booking-24bda70369

# Install dependencies
npm install
# or
pnpm install

# Create environment variables file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Node Environment
NODE_ENV=development
```

### Running Locally

```bash
# Development mode
npm run dev

# Open browser
# Visit http://localhost:3000
```

### Building for Production

```bash
npm run build
npm start
```

---

## 📊 Project Structure

train-booking-24bda70369/
├── pages/
│   ├── api/                 # API routes (backend)
│   │   ├── auth/           # Authentication endpoints
│   │   ├── trains/         # Train search & booking
│   │   ├── payments/       # Payment gateway webhooks
│   │   └── admin/          # Admin panel APIs
│   ├── auth/               # Auth pages (login, signup)
│   ├── search/             # Train search page
│   ├── booking/            # Booking details page
│   └── admin/              # Admin dashboard
├── components/            # Reusable React components
├── lib/                   # Utility functions
├── models/                # MongoDB schemas
├── public/                # Static assets
└── styles/                # CSS files

---

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/signup` — User registration
- `POST /api/auth/login` — User login
- `POST /api/auth/logout` — User logout

### Trains & Booking
- `GET /api/trains/search` — Search trains by route and date
- `GET /api/trains/:id/seats` — Get seat availability
- `POST /api/bookings/create` — Create a booking
- `GET /api/bookings/:userId` — Get user's bookings
- `DELETE /api/bookings/:bookingId` — Cancel booking

### Payments
- `POST /api/payments/create-order` — Create Razorpay order
- `POST /api/payments/verify` — Verify payment webhook
- `GET /api/payments/:bookingId/status` — Get payment status

### Admin
- `GET /api/admin/analytics` — Dashboard analytics
- `GET /api/admin/bookings` — All bookings (admin only)
- `POST /api/admin/routes` — Add new train routes

---

## 📚 Key Learnings

### 1. **Full-Stack Architecture**
- Integrated Next.js frontend and backend seamlessly
- Designed RESTful API endpoints for clear separation of concerns
- Implemented middleware for request validation and error handling

### 2. **Payment Integration**
- Integrated Razorpay payment gateway securely
- Handled webhook callbacks for payment confirmation
- Implemented idempotency to prevent duplicate charges
- Managed payment states (pending, success, failed)

### 3. **Database Optimization**
- Pre-seeded 100+ Indian train routes efficiently
- Optimized MongoDB queries with proper indexing
- Implemented pagination for large datasets
- Used connection pooling for better performance

### 4. **State Management**
- Chose Zustand over Redux for lightweight global state
- Managed user authentication state across pages
- Persisted user session with localStorage

### 5. **Authentication & Security**
- Implemented JWT-based authentication
- Stored passwords securely with bcrypt hashing
- Protected API routes with authentication middleware
- Implemented role-based access control (user vs admin)

### 6. **Deployment & CI/CD**
- Deployed to Vercel with automatic deployments on Git push
- Managed environment variables across environments
- Set up GitHub Actions for automated testing
- Debugged production issues with Vercel logs

---

## 🎯 What I'd Do Differently (v2.0)

- [ ] Add real-time seat updates using WebSockets for concurrent bookings
- [ ] Implement comprehensive error handling and user-friendly error messages
- [ ] Add unit & integration tests with Jest & Supertest
- [ ] Improve admin dashboard with more granular analytics
- [ ] Separate admin routes with stricter role-based access control
- [ ] Add email notifications for bookings and payment receipts
- [ ] Implement Redis caching for frequently accessed data
- [ ] Add seat map visualization for better UX

---

## 📖 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Docs](https://docs.mongodb.com/)
- [Razorpay Integration Guide](https://razorpay.com/docs/)
- [JWT Guide](https://jwt.io/introduction)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 💬 Questions?

Feel free to reach out:
- **Email:** himanshugoya786@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/himanshu-goyal-231816336/
- **GitHub Issues:** [Open an issue on this repo](https://github.com/thehimanshugoyl/train-booking-24bda70369/issues)

---

## 🙏 Acknowledgments

- [Mr. Dheeresh Aggarwal](https://github.com/dheereshag) — Lab supervisor & mentor
- [Chandigarh University](https://www.cuchd.in/) — Academic support
- Open source community for tools and libraries

---

**Last updated:** May 2026  
**Status:** ✅ Live & Active
