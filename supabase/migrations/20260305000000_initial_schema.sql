-- Supabase Database Schema for Findr Lost & Found System
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schools Table
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  join_code VARCHAR(10) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table (Students & Staff)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'staff', 'admin')),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  auth_id VARCHAR(255) NOT NULL UNIQUE,
  student_id VARCHAR(50),
  grade VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lost Items Table
CREATE TABLE lost_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  location TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'claimed', 'resolved', 'donated')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Found Items Table
CREATE TABLE found_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  location TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'claimed', 'resolved', 'donated')),
  pickup_location_text TEXT,
  pickup_at TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Item Matches Table
CREATE TABLE item_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lost_item_id UUID REFERENCES lost_items(id) ON DELETE CASCADE,
  found_item_id UUID REFERENCES found_items(id) ON DELETE CASCADE,
  ai_confidence DECIMAL(5,2),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims Table
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES lost_items(id) ON DELETE CASCADE,
  claimant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Settings Table
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  item_found_notifications BOOLEAN DEFAULT true,
  item_matched_notifications BOOLEAN DEFAULT true,
  donation_reminders BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Schools Policies
CREATE POLICY "Users can view schools" ON schools FOR SELECT USING (auth.uid() = auth.uid());

-- Users Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = auth.uid());
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = auth.uid());
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = auth.uid());

-- Lost Items Policies
CREATE POLICY "Users can view all lost items" ON lost_items FOR SELECT USING (auth.uid() = auth.uid());
CREATE POLICY "Users can insert own lost items" ON lost_items FOR INSERT WITH CHECK (auth.uid() = auth.uid());
CREATE POLICY "Users can update own lost items" ON lost_items FOR UPDATE USING (auth.uid() = auth.uid());

-- Found Items Policies
CREATE POLICY "Users can view all found items" ON found_items FOR SELECT USING (auth.uid() = auth.uid());
CREATE POLICY "Users can insert own found items" ON found_items FOR INSERT WITH CHECK (auth.uid() = auth.uid());
CREATE POLICY "Users can update own found items" ON found_items FOR UPDATE USING (auth.uid() = auth.uid());

-- Item Matches Policies
CREATE POLICY "Users can view all item matches" ON item_matches FOR SELECT USING (auth.uid() = auth.uid());
CREATE POLICY "Users can insert own item matches" ON item_matches FOR INSERT WITH CHECK (auth.uid() = auth.uid());

-- Claims Policies
CREATE POLICY "Users can view all claims" ON claims FOR SELECT USING (auth.uid() = auth.uid());
CREATE POLICY "Users can insert own claims" ON claims FOR INSERT WITH CHECK (auth.uid() = auth.uid());
CREATE POLICY "Users can update own claims" ON claims FOR UPDATE USING (auth.uid() = auth.uid());

-- Notification Settings Policies
CREATE POLICY "Users can view own notification settings" ON notification_settings FOR SELECT USING (auth.uid() = auth.uid());
CREATE POLICY "Users can insert own notification settings" ON notification_settings FOR INSERT WITH CHECK (auth.uid() = auth.uid());
CREATE POLICY "Users can update own notification settings" ON notification_settings FOR UPDATE USING (auth.uid() = auth.uid());

-- Audit Logs Policies
CREATE POLICY "Users can view own audit logs" ON audit_logs FOR SELECT USING (auth.uid() = auth.uid());
CREATE POLICY "Users can insert own audit logs" ON audit_logs FOR INSERT WITH CHECK (auth.uid() = auth.uid());
