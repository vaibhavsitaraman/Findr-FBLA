import { createClient } from '@supabase/supabase-js';

// Use Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rnyaxdbbzzirbqgnbjsq.supabase.co/';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJueWF4ZGJienppcmJxZ25ianNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTIzMzcsImV4cCI6MjA4NzU2ODMzN30.jwzC7KNT3oa-aKVUD508cduZXIP_B4jsijfu4J0DB6I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
export interface School {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'staff' | 'admin';
  school_id?: string;
  student_id?: string;
  grade?: string;
  auth_id: string;
  created_at: string;
  updated_at: string;
}

export interface LostItem {
  id: string;
  user_id: string;
  school_id?: string;
  title: string;
  description?: string;
  category?: string;
  location?: string;
  status: 'active' | 'claimed' | 'resolved' | 'donated';
  date_claimed?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface FoundItem {
  id: string;
  user_id: string;
  school_id?: string;
  title: string;
  description?: string;
  category?: string;
  location?: string;
  status: 'active' | 'matched' | 'claimed' | 'resolved' | 'donated';
  matched_lost_item_id?: string;
  pickup_location?: string;
  pickup_date?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ItemMatch {
  id: string;
  lost_item_id: string;
  found_item_id: string;
  confidence_score?: number;
  match_reason?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  item_found_notifications: boolean;
  item_matched_notifications: boolean;
  donation_reminders: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  table_name?: string;
  record_id?: string;
  old_values?: any;
  new_values?: any;
  created_at: string;
}
