-- ====================================================================
-- GADDVYA Real-World PostgreSQL Schema for Supabase
-- Run this entire script in Supabase: Dashboard > SQL Editor > New query > Run
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USERS TABLE (Citizen Authentication & Passenger Profile)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    gender TEXT DEFAULT 'Male',
    dob TEXT,
    state TEXT,
    city TEXT,
    id_proof_type TEXT DEFAULT 'Aadhaar Card',
    id_proof_number TEXT,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. OTPS TABLE (Email & Phone One-Time Passcodes with TTL)
CREATE TABLE IF NOT EXISTS otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,
    code TEXT NOT NULL,
    type TEXT NOT NULL, -- 'email' or 'phone'
    purpose TEXT NOT NULL, -- 'register' or 'login'
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRAINS TABLE (Supports 25,571 Daily Indian Railways Fleet)
CREATE TABLE IF NOT EXISTS trains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_number TEXT UNIQUE NOT NULL,
    train_name TEXT NOT NULL,
    train_type TEXT NOT NULL,
    from_station TEXT NOT NULL,
    to_station TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    duration TEXT NOT NULL,
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    price INTEGER NOT NULL,
    date TEXT NOT NULL,
    runs_on TEXT DEFAULT 'Daily',
    classes JSONB DEFAULT '[]'::jsonb,
    intermediate_stations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOOKINGS TABLE (Indian Railways PNR & Passenger Allocations)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pnr TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    train_id UUID REFERENCES trains(id) ON DELETE SET NULL,
    train_number TEXT NOT NULL,
    train_name TEXT NOT NULL,
    from_station TEXT NOT NULL,
    to_station TEXT NOT NULL,
    date TEXT NOT NULL,
    class_type TEXT NOT NULL,
    seats JSONB DEFAULT '[]'::jsonb,
    passengers JSONB DEFAULT '[]'::jsonb,
    total_price INTEGER NOT NULL,
    status TEXT DEFAULT 'Confirmed',
    payment_status TEXT DEFAULT 'Completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. VISITS TABLE (Analytics Tracking)
CREATE TABLE IF NOT EXISTS visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page TEXT NOT NULL,
    visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PERFORMANCE INDEXES (High-Speed Search across 25,000+ trains)
CREATE INDEX IF NOT EXISTS idx_trains_route ON trains(from_station, to_station);
CREATE INDEX IF NOT EXISTS idx_trains_number ON trains(train_number);
CREATE INDEX IF NOT EXISTS idx_trains_date ON trains(date);
CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON bookings(pnr);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_otps_identifier ON otps(identifier, purpose);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Allow public read access to trains for search
DROP POLICY IF EXISTS "Public trains read" ON trains;
CREATE POLICY "Public trains read" ON trains FOR SELECT USING (true);

-- Allow full backend access using anon or service key
DROP POLICY IF EXISTS "Backend full access users" ON users;
CREATE POLICY "Backend full access users" ON users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Backend full access otps" ON otps;
CREATE POLICY "Backend full access otps" ON otps FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Backend full access trains" ON trains;
CREATE POLICY "Backend full access trains" ON trains FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Backend full access bookings" ON bookings;
CREATE POLICY "Backend full access bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Backend full access visits" ON visits;
CREATE POLICY "Backend full access visits" ON visits FOR ALL USING (true) WITH CHECK (true);

-- 9. DEFAULT SEED ADMIN & DEMO USER
-- Default password: password123 (bcrypt hash: $2a$10$w8Ylq9y9Wc3zP6mQZ0W8qOB1b7C4wJ1R7l2b0z9F7G8H9J0K1L2M3)
-- Real password hashes will be set through the registration endpoint.
