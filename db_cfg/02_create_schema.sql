-- ====================================================================
-- College Event Management System (CampusPulse) - Schema DDL
-- DBMS Project - Relational Schema Definition
-- ====================================================================

-- Connect to database
\c event_management;

-- Drop existing tables (clean recreation)
DROP TABLE IF EXISTS "Payment" CASCADE;
DROP TABLE IF EXISTS "Registration" CASCADE;
DROP TABLE IF EXISTS "Event" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Drop existing enum types if present
DROP TYPE IF EXISTS "PaymentMethod" CASCADE;
DROP TYPE IF EXISTS "PaymentStatus" CASCADE;
DROP TYPE IF EXISTS "RegistrationStatus" CASCADE;
DROP TYPE IF EXISTS "EventStatus" CASCADE;
DROP TYPE IF EXISTS "Category" CASCADE;
DROP TYPE IF EXISTS "Role" CASCADE;

-- ====================================================================
-- 1. ENUMS (Custom Types)
-- ====================================================================

CREATE TYPE "Role" AS ENUM (
    'ADMIN',
    'USER'
);

CREATE TYPE "Category" AS ENUM (
    'TECH',
    'CULTURAL',
    'WORKSHOP',
    'INFORMALS'
);

CREATE TYPE "EventStatus" AS ENUM (
    'UPCOMING',
    'ONGOING',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE "RegistrationStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED'
);

CREATE TYPE "PaymentStatus" AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAILED',
    'REFUNDED'
);

CREATE TYPE "PaymentMethod" AS ENUM (
    'UPI',
    'CARD',
    'NET_BANKING',
    'WALLET'
);

-- ====================================================================
-- 2. TABLES & PRIMARY KEYS
-- ====================================================================

-- User Table (Admins and Students)
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "phone" VARCHAR(20),
    "department" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Event Table (Created by Admin)
CREATE TABLE "Event" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "venue" VARCHAR(255) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "maxCapacity" INTEGER NOT NULL CHECK ("maxCapacity" > 0),
    "fee" DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK ("fee" >= 0.00),
    "category" "Category" NOT NULL,
    "imageUrl" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Registration Table (Student booking for an event)
CREATE TABLE "Registration" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Composite Unique Constraint: A student can only register once per event
    CONSTRAINT "Registration_userId_eventId_key" UNIQUE ("userId", "eventId")
);

-- Payment Table (Razorpay Sandbox transactions for paid events)
CREATE TABLE "Payment" (
    "id" SERIAL PRIMARY KEY,
    "registrationId" INTEGER NOT NULL UNIQUE, -- 1:1 relationship
    "amount" DECIMAL(10, 2) NOT NULL CHECK ("amount" >= 0.00),
    "method" "PaymentMethod" NOT NULL DEFAULT 'UPI',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayOrderId" VARCHAR(100) UNIQUE,
    "razorpayPaymentId" VARCHAR(100) UNIQUE,
    "razorpaySignature" VARCHAR(255),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 3. FOREIGN KEY CONSTRAINTS (Referential Integrity)
-- ====================================================================

-- Event -> User (Admin creator)
ALTER TABLE "Event" 
    ADD CONSTRAINT "Event_createdById_fkey" 
    FOREIGN KEY ("createdById") REFERENCES "User"("id") 
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Registration -> User (Student)
ALTER TABLE "Registration" 
    ADD CONSTRAINT "Registration_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Registration -> Event
ALTER TABLE "Registration" 
    ADD CONSTRAINT "Registration_eventId_fkey" 
    FOREIGN KEY ("eventId") REFERENCES "Event"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Payment -> Registration (1:1 cascade)
ALTER TABLE "Payment" 
    ADD CONSTRAINT "Payment_registrationId_fkey" 
    FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ====================================================================
-- 4. INDEXES (Query Optimization)
-- ====================================================================

CREATE INDEX "Event_category_idx" ON "Event"("category");
CREATE INDEX "Event_status_idx" ON "Event"("status");
CREATE INDEX "Registration_userId_idx" ON "Registration"("userId");
CREATE INDEX "Registration_eventId_idx" ON "Registration"("eventId");
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
