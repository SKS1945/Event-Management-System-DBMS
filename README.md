# CampusPulse — College Event Management System

A full-stack College Event Management System built for a DBMS course project with **one admin** and **multiple student users**. Admin manages events, monitors attendee capacity, and reviews financial ledgers; students explore events across categories, register, pay fees via Razorpay Sandbox, and manage tickets.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Vite, React Router DOM, React Hot Toast, React Icons
- **Backend:** Node.js, Express.js, TypeScript, tsx, JWT (jsonwebtoken), Bcryptjs, Razorpay SDK
- **Database & ORM:** PostgreSQL, Prisma ORM
- **Payment Gateway:** Razorpay Sandbox (UPI, Card, Net Banking)
- **Version Control:** Git with phase-tagged commits (`v0.1` – `v0.6`)

---

## 🏛️ Database Schema & Relational Design

```mermaid
erDiagram
    USER {
        int id PK
        string name
        string email UK
        string password
        enum role "ADMIN | USER"
        string phone
        string department
        datetime createdAt
    }
    EVENT {
        int id PK
        string title
        text description
        string venue
        datetime date
        int maxCapacity
        decimal fee
        enum category "TECH | CULTURAL | WORKSHOP | INFORMALS"
        string imageUrl
        enum status "UPCOMING | ONGOING | COMPLETED | CANCELLED"
        int createdById FK
        datetime createdAt
        datetime updatedAt
    }
    REGISTRATION {
        int id PK
        int userId FK
        int eventId FK
        enum status "PENDING | CONFIRMED | CANCELLED"
        datetime registeredAt
    }
    PAYMENT {
        int id PK
        int registrationId FK "UK"
        decimal amount
        enum method "UPI | CARD | NET_BANKING | WALLET"
        enum status "PENDING | SUCCESS | FAILED | REFUNDED"
        string razorpayOrderId UK
        string razorpayPaymentId UK
        string razorpaySignature
        datetime paidAt
        datetime createdAt
    }

    USER ||--o{ EVENT : "creates (admin)"
    USER ||--o{ REGISTRATION : "registers"
    EVENT ||--o{ REGISTRATION : "has"
    REGISTRATION ||--o| PAYMENT : "has (1:1)"
```

### DBMS Concepts Demonstrated for Project Evaluation

1. **Foreign Key Constraints & Referential Integrity:**
   - `Event.createdById` references `User.id`
   - `Registration.userId` references `User.id` (`ON DELETE CASCADE`)
   - `Registration.eventId` references `Event.id` (`ON DELETE CASCADE`)
   - `Payment.registrationId` references `Registration.id` (`ON DELETE CASCADE`)
2. **Unique Constraints:**
   - `User.email` is strictly unique
   - Composite unique constraint `@@unique([userId, eventId])` on `Registration` prevents duplicate student registrations for the same event
   - `Payment.registrationId` is unique (enforcing strict 1:1 relationship between registration and payment)
3. **Capacity Constraints & Business Logic:**
   - Active registrations check: `COUNT(registrations WHERE status != 'CANCELLED') < maxCapacity`
   - Prevents overbooking beyond venue limits
4. **Aggregate Queries (`SUM`, `COUNT`):**
   - Revenue summation: `SUM(Payment.amount) WHERE status = 'SUCCESS'`
   - Registrations count: `COUNT(Registration.id) WHERE status != 'CANCELLED'`
5. **Group By Aggregation:**
   - Total registrations broken down by Event Category (`TECH`, `CULTURAL`, `WORKSHOP`, `INFORMALS`)
6. **ACID Transactions (`prisma.$transaction`):**
   - Payment verification atomically updates `Payment.status = SUCCESS` and `Registration.status = CONFIRMED`
   - Registration cancellation atomically updates `Registration.status = CANCELLED` and refunds paid amount

---

## 🎭 Event Categories

- 💻 **TECH:** 24-Hour Hackathons, Competitive Algorithmic Coding (CodeSprint)
- 🎭 **CULTURAL:** Inter-College Music Fest (Rhythm & Raag), Dance Showcase (Nrityanjali)
- 🛠️ **WORKSHOP:** Generative AI & Autonomous Agents, Cloud DevOps & Kubernetes
- 🎯 **INFORMALS:** Neon Laser Tag Arena, Soapy Football Championship, Campus Treasure Hunt

---

## 🔑 Default Credentials

| Role | Email | Password | Quick Demo Fill |
|---|---|---|---|
| **Admin** | `admin@college.edu` | `admin123` | Click "Admin Account" button on Login page |
| **Student** | `student@college.edu` | `student123` | Click "Student Account" button on Login page |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL service running on `localhost:5432`

### 1. Database Setup
```bash
# Connect to PostgreSQL and create database
psql -d postgres -c "CREATE DATABASE event_management;"
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies (already completed)
npm install

# Configure environment variables in backend/.env
# DATABASE_URL="postgresql://souren:postgres@localhost:5432/event_management?schema=public"
# JWT_SECRET="college_event_mgmt_super_secret_jwt_key_2026"
# RAZORPAY_KEY_ID="rzp_test_placeholder"
# RAZORPAY_KEY_SECRET="placeholder_secret"
# PORT=5000

# Run migrations and seed data
npx prisma migrate dev
npx tsx prisma/seed.ts

# Start backend development server
npm run dev
```
Backend runs at: `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies (already completed)
npm install

# Start frontend development server
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 💳 Razorpay Sandbox Payment Integration

- **Sandbox mode:** Fully integrated using the official Razorpay Node.js SDK and client-side checkout modal.
- If testing with default placeholder keys (`rzp_test_placeholder`), the backend sandbox simulator automatically verifies test orders for frictionless grading.
- To link your live Razorpay test account:
  1. Go to [dashboard.razorpay.com](https://dashboard.razorpay.com) -> Settings -> API Keys -> Generate Test Key.
  2. Put your `key_id` and `key_secret` in `backend/.env` and `frontend/.env`.
  3. Use Razorpay test card: `4111 1111 1111 1111`, any future expiry date, and any 3-digit CVV.

---

## 🏷️ Git Version Control History (Phases)

| Tag | Phase Description |
|---|---|
| `v0.1-setup` | Project setup, Prisma schema, PostgreSQL migration, initial seed, Vite + Tailwind config |
| `v0.2-auth` | Auth system — JWT, signup, login, profile, protected routes, typed middleware |
| `v0.3-events` | Admin event CRUD, dashboard stats, categories, registrations view |
| `v0.4-registrations` | User event browsing, registration, capacity checks, My Registrations |
| `v0.5-payments` | Razorpay sandbox payments, order creation, signature verification, financial ledger |
| `v0.6-final` | Polish, comprehensive seed data, responsive layout, full verification |

---

## 🧪 Verification & Automated Checks

- **Backend Typecheck:** `cd backend && npx tsc --noEmit` (Passes with 0 errors)
- **Frontend Build:** `cd frontend && npm run build` (Passes with 0 errors)
- **Database Seed:** `cd backend && npx tsx prisma/seed.ts` (Seeds Admin + Students + 9 Events + Registrations + Payments)
