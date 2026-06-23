# LegalEase — Online Lawyer Hiring Platform

![LegalEase Banner](https://i.imgur.com/placeholder.png)

> A full-stack MERN application that connects legal seekers with verified lawyers. Browse, hire, and pay legal experts online — with role-based dashboards, Stripe payments, and real-time analytics.

---

## 🌐 Live Links

| Service | URL |
|--------|-----|
| 🖥️ Client (Frontend) | [https://legal-ease-client-jet.vercel.app](https://legal-ease-client-jet.vercel.app)  |
| ⚙️ Server (Backend) | [https://legal-ease-server-five.vercel.app](https://legal-ease-server-five.vercel.app) |
| 📁 Client Repository | [https://github.com/Tariqul-stack/LegalEase_client](https://github.com/Tariqul-stack/LegalEase_client) |
| 📁 Server Repository | [https://github.com/Tariqul-stack/LegalEase-server](https://github.com/Tariqul-stack/LegalEase-server) |

---

## 📌 Project Overview

Traditional legal hiring is often limited to law firms or physical consultations. **LegalEase** democratizes access to legal aid by providing an online marketplace where clients can discover and hire verified lawyers, lawyers can manage their services and accept/reject cases, and admins can oversee the entire platform with analytics.

---

## 👥 User Roles & Capabilities

### 👤 User (Client)
- Register and login with email/password or Google OAuth
- Browse and search lawyers by name, specialization, and fee range
- View detailed lawyer profiles with bio, fee, and availability
- Send hiring requests and track their status (pending/accepted/rejected)
- Pay hiring fees securely via Stripe
- Post, edit, and delete reviews (only after hiring)
- View hiring history and payment transactions
- Update profile and upload photo via imgBB

### ⚖️ Lawyer
- Register and manage a professional legal profile
- Upload profile photo via imgBB
- Accept or reject incoming hiring requests
- Track hiring history and earnings
- Toggle availability status (Available / Busy)
- Edit bio, specialization, and consultation fee

### 🔐 Admin
- Manage all users — change roles, delete accounts
- View all platform transactions
- Access analytics dashboard:
  - Total users, lawyers, hires, and revenue
- Full access to all platform features

---

## ✨ Key Features

- 🔐 **JWT Authentication** — secure email/password login with 7-day token expiry
- 🔗 **Google OAuth** — one-click login via Google Console
- 👥 **Role-Based Access Control** — user, lawyer, and admin dashboards with protected routes
- 💳 **Stripe Payment Integration** — secure card payments for hiring fees
- 🖼️ **imgBB Image Upload** — profile photo upload for users and lawyers
- 💬 **Comment System** — only users who have hired a lawyer can leave reviews
- 📊 **Admin Analytics** — real-time stats with revenue tracking
- 🔍 **Search & Filter** — filter lawyers by name, specialization, and fee range
- 📄 **Pagination** — 8 lawyers per page on browse page
- 🔔 **Toast Notifications** — real-time feedback via react-hot-toast
- 💀 **Skeleton Loaders** — smooth loading states for better UX
- 📱 **Fully Responsive** — mobile-first design with Tailwind CSS
- ⚡ **Framer Motion Animations** — smooth page transitions and reveal effects

---

## 🛠️ Tech Stack

### Frontend
| Package | Version | Purpose |
|--------|---------|---------|
| `next` | 14 | Frontend framework (App Router) |
| `react` | 19 | UI library |
| `tailwindcss` | 4 | Utility-first CSS framework |
| `framer-motion` | latest | Animations and transitions |
| `axios` | latest | HTTP client for API requests |
| `@tanstack/react-query` | latest | Server state management |
| `@stripe/stripe-js` | latest | Stripe payment (client-side) |
| `@stripe/react-stripe-js` | latest | Stripe React components |
| `@react-oauth/google` | latest | Google OAuth login |
| `react-hot-toast` | latest | Toast notifications |
| `react-icons` | latest | Icon library |
| `jwt-decode` | latest | JWT token decoding |
| `better-auth` | latest | Authentication helper |

### Backend
| Package | Version | Purpose |
|--------|---------|---------|
| `express` | 5 | Backend web framework |
| `mongoose` | 9 | MongoDB ODM |
| `jsonwebtoken` | 9 | JWT token generation & verification |
| `bcryptjs` | 3 | Password hashing |
| `stripe` | latest | Payment processing |
| `cors` | latest | Cross-origin request handling |
| `dotenv` | latest | Environment variable management |
| `nodemon` | latest | Development auto-restart |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Stripe account (test mode)
- imgBB account
- Google Cloud Console project

### 1. Clone the Repositories

```bash
git clone https://github.com/Tariqul-stack/LegalEase_client.git
git clone https://github.com/Tariqul-stack/LegalEase-server.git
```

### 2. Server Setup

```bash
cd LegalEase-server
npm install
```

Create a `.env` file in the root:

```env
PORT=8000
MONGO_DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/legalEase_db
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

Seed the database with sample data:

```bash
node src/seed.js
```

Start the development server:

```bash
npm run dev
```

Server runs on: `http://localhost:8000`

### 3. Client Setup

```bash
cd LegalEase_client
npm install
```

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

Start the development server:

```bash
npm run dev
```

Client runs on: `http://localhost:3000`

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@legalease.com | admin123 |
| Lawyer | james.wilson@legalease.com | admin123 |
| User | Register a new account | — |

---

## 💳 Stripe Test Card

Use the following test card for payments:

| Field | Value |
|-------|-------|
| Card Number | `4242 4242 4242 4242` |
| Expiry | Any future date (e.g. `12/34`) |
| CVC | Any 3 digits (e.g. `123`) |
| ZIP | Any 5 digits (e.g. `12345`) |

---

## 📁 Project Structure

### Client (Next.js App Router)

```
legalease-client/
├── app/
│   ├── (auth)/
│   │   ├── login/page.jsx
│   │   └── register/page.jsx
│   ├── browse/page.jsx
│   ├── lawyers/[id]/page.jsx
│   ├── dashboard/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── user/
│   │   │   ├── hiring-history/page.jsx
│   │   │   ├── comments/page.jsx
│   │   │   ├── transactions/page.jsx
│   │   │   └── update-profile/page.jsx
│   │   ├── lawyer/
│   │   │   ├── hiring-history/page.jsx
│   │   │   ├── manage-legal-profile/page.jsx
│   │   │   └── transactions/page.jsx
│   │   └── admin/
│   │       ├── manage-users/page.jsx
│   │       ├── all-transactions/page.jsx
│   │       └── analytics/page.jsx
│   ├── unauthorized/page.jsx
│   ├── not-found.jsx
│   ├── loading.jsx
│   ├── error.jsx
│   └── layout.js
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ImageUpload.jsx
│   ├── PaymentModal.jsx
│   ├── QueryProvider.jsx
│   └── Toast.jsx
├── lib/
│   └── axios.js
├── hooks/
│   └── useAuth.js
└── .env.local
```

### Server (Express.js)

```
legalease-server/
└── src/
    ├── models/
    │   ├── user.model.js
    │   ├── lawyer.model.js
    │   ├── hiring.model.js
    │   ├── comment.model.js
    │   └── transaction.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── lawyer.routes.js
    │   ├── hiring.routes.js
    │   ├── comment.routes.js
    │   ├── admin.routes.js
    │   └── user.routes.js
    ├── middleware/
    │   ├── verifyToken.js
    │   └── checkRole.js
    ├── seed.js
    └── index.js
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login with email/password |
| POST | `/api/auth/google-login` | Public | Login with Google OAuth |

### Lawyers
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/lawyers` | Public | Get all published lawyers |
| GET | `/api/lawyers/:id` | Public | Get single lawyer |
| POST | `/api/lawyers` | Lawyer | Create lawyer profile |
| PUT | `/api/lawyers/:id` | Lawyer | Update lawyer profile |
| DELETE | `/api/lawyers/:id` | Admin | Delete lawyer |

### Hirings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/hirings` | User | Create hiring request |
| GET | `/api/hirings/user` | User | Get user's hiring history |
| GET | `/api/hirings/lawyer` | Lawyer | Get lawyer's hiring requests |
| PATCH | `/api/hirings/:id/status` | Lawyer | Accept or reject hiring |
| POST | `/api/hirings/:id/pay` | User | Create Stripe payment intent |
| POST | `/api/hirings/:id/confirm-payment` | User | Confirm payment & save transaction |

### Comments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/comments` | User (hired only) | Post a review |
| GET | `/api/comments/:lawyerId` | Public | Get comments for a lawyer |
| GET | `/api/comments/user/my-comments` | User | Get logged-in user's comments |
| PUT | `/api/comments/:id` | User | Edit comment |
| DELETE | `/api/comments/:id` | User | Delete comment |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/users` | Admin | Get all users |
| PATCH | `/api/admin/users/:id/role` | Admin | Change user role |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
| GET | `/api/admin/transactions` | Admin | Get all transactions |
| GET | `/api/admin/analytics` | Admin | Get platform analytics |

---

## 🌍 Deployment

| Service | Platform |
|--------|----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Vercel](https://vercel.com) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) |
| Image Hosting | [imgBB](https://imgbb.com) |
| Payments | [Stripe](https://stripe.com) |