-- Supabase Database Schema for Findr Lost & Found System
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Needed for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Schools Table
CREATE TABLE schools (
  -- Use join code as the canonical school ID
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table (Students & Staff)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'staff', 'admin')),
  school_id VARCHAR(10) REFERENCES schools(id) ON DELETE RESTRICT,
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id VARCHAR(50),
  grade VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lost Items Table
CREATE TABLE lost_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  school_id VARCHAR(10) REFERENCES schools(id) ON DELETE RESTRICT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  location TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'claimed', 'resolved', 'donated')),
  date_claimed TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Found Items Table
CREATE TABLE found_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  school_id VARCHAR(10) REFERENCES schools(id) ON DELETE RESTRICT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  location TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'matched', 'claimed', 'resolved', 'donated')),
  matched_lost_item_id UUID REFERENCES lost_items(id) ON DELETE SET NULL,
  pickup_location TEXT,
  pickup_date TIMESTAMP WITH TIME ZONE,
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

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION public.get_my_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT u.id
  FROM public.users u
  WHERE u.auth_id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_my_school_id()
RETURNS VARCHAR
LANGUAGE sql
STABLE
AS $$
  SELECT u.school_id
  FROM public.users u
  WHERE u.auth_id = auth.uid()
  LIMIT 1;
$$;

-- Triggers to ensure items inherit school_id from the posting user
CREATE OR REPLACE FUNCTION public.set_item_school_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.school_id IS NULL THEN
    SELECT u.school_id INTO NEW.school_id
    FROM public.users u
    WHERE u.id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_lost_items_set_school_id
BEFORE INSERT ON public.lost_items
FOR EACH ROW
EXECUTE FUNCTION public.set_item_school_id();

CREATE TRIGGER trg_found_items_set_school_id
BEFORE INSERT ON public.found_items
FOR EACH ROW
EXECUTE FUNCTION public.set_item_school_id();

-- Schools Policies
CREATE POLICY "Users can view schools" ON schools
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Users Policies
CREATE POLICY "Users can view own profile" ON users
FOR SELECT
USING (auth_id = auth.uid());

CREATE POLICY "Users can update own profile" ON users
FOR UPDATE
USING (auth_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON users
FOR INSERT
WITH CHECK (auth_id = auth.uid());

-- Lost Items Policies
CREATE POLICY "Users can view lost items in their school" ON lost_items
FOR SELECT
USING (school_id = public.get_my_school_id());

CREATE POLICY "Users can insert own lost items" ON lost_items
FOR INSERT
WITH CHECK (
  user_id = public.get_my_user_id()
  AND (school_id IS NULL OR school_id = public.get_my_school_id())
);

CREATE POLICY "Users can update own lost items" ON lost_items
FOR UPDATE
USING (user_id = public.get_my_user_id());

-- Found Items Policies
CREATE POLICY "Users can view found items in their school" ON found_items
FOR SELECT
USING (school_id = public.get_my_school_id());

CREATE POLICY "Users can insert own found items" ON found_items
FOR INSERT
WITH CHECK (
  user_id = public.get_my_user_id()
  AND (school_id IS NULL OR school_id = public.get_my_school_id())
);

CREATE POLICY "Users can update own found items" ON found_items
FOR UPDATE
USING (user_id = public.get_my_user_id());

-- Item Matches Policies
CREATE POLICY "Users can view item matches" ON item_matches
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert item matches" ON item_matches
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Claims Policies
CREATE POLICY "Users can view claims in their school" ON claims
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.lost_items li
    WHERE li.id = claims.listing_id
      AND li.school_id = public.get_my_school_id()
  )
);

CREATE POLICY "Users can insert own claims" ON claims
FOR INSERT
WITH CHECK (
  claimant_id = public.get_my_user_id()
  AND EXISTS (
    SELECT 1
    FROM public.lost_items li
    WHERE li.id = claims.listing_id
      AND li.school_id = public.get_my_school_id()
  )
);

CREATE POLICY "Users can update own claims" ON claims
FOR UPDATE
USING (claimant_id = public.get_my_user_id());

-- Notification Settings Policies
CREATE POLICY "Users can view own notification settings" ON notification_settings
FOR SELECT
USING (user_id = public.get_my_user_id());

CREATE POLICY "Users can insert own notification settings" ON notification_settings
FOR INSERT
WITH CHECK (user_id = public.get_my_user_id());

CREATE POLICY "Users can update own notification settings" ON notification_settings
FOR UPDATE
USING (user_id = public.get_my_user_id());

-- Audit Logs Policies
CREATE POLICY "Users can view audit logs in their school" ON audit_logs
FOR SELECT
USING (
  user_id IS NULL
  OR EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = audit_logs.user_id
      AND u.school_id = public.get_my_school_id()
  )
);

CREATE POLICY "Users can insert audit logs" ON audit_logs
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
