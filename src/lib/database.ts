import { supabase, User, LostItem, FoundItem, NotificationSettings, School } from './supabase';

// User Management
export class UserService {
  static async createUser(userData: {
    email: string;
    full_name: string;
    role: 'student' | 'staff' | 'admin';
    school_id: string;
    student_id?: string;
    grade?: string;
    auth_id: string;
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUser(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserByAuthId(authId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  }

  static async getUsersBySchool(schoolId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('school_id', schoolId);

    if (error) throw error;
    return data;
  }
}

// School Management
export class SchoolService {
  static async createSchool(schoolData: { name: string; id: string }) {
    const { data, error } = await supabase
      .from('schools')
      .insert(schoolData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getSchoolByName(name: string) {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('name', name)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async getSchoolByJoinCode(joinCode: string) {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', joinCode)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async getSchoolById(schoolId: string) {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', schoolId)
      .single();

    if (error) throw error;
    return data;
  }
}

// Lost Items Management
export class LostItemService {
  static async createLostItem(itemData: Omit<LostItem, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('lost_items')
      .insert(itemData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getLostItemsByUser(userId: string) {
    const { data, error } = await supabase
      .from('lost_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getLostItemsBySchool(schoolId: string) {
    const { data, error } = await supabase
      .from('lost_items')
      .select(`
        *,
        users!inner(
          full_name,
          email
        )
      `)
      .eq('users.school_id', schoolId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateLostItem(itemId: string, updates: Partial<LostItem>) {
    const { data, error } = await supabase
      .from('lost_items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async claimLostItem(itemId: string, claimedByUserId: string) {
    const { data, error } = await supabase
      .from('lost_items')
      .update({ 
        status: 'claimed', 
        date_claimed: new Date().toISOString() 
      })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

// Found Items Management
export class FoundItemService {
  static async createFoundItem(itemData: Omit<FoundItem, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('found_items')
      .insert(itemData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getFoundItemsByUser(userId: string) {
    const { data, error } = await supabase
      .from('found_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getFoundItemsBySchool(schoolId: string) {
    const { data, error } = await supabase
      .from('found_items')
      .select(`
        *,
        users!inner(
          full_name,
          email
        )
      `)
      .eq('users.school_id', schoolId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateFoundItem(itemId: string, updates: Partial<FoundItem>) {
    const { data, error } = await supabase
      .from('found_items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async matchFoundItem(foundItemId: string, lostItemId: string) {
    const { data, error } = await supabase
      .from('found_items')
      .update({ 
        matched_lost_item_id: lostItemId,
        status: 'matched'
      })
      .eq('id', foundItemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

// Notification Settings Management
export class NotificationService {
  static async createNotificationSettings(settings: Omit<NotificationSettings, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('notification_settings')
      .insert(settings)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getNotificationSettings(userId: string) {
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateNotificationSettings(userId: string, updates: Partial<NotificationSettings>) {
    const { data, error } = await supabase
      .from('notification_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async toggleNotification(userId: string, field: keyof NotificationSettings) {
    // Get current settings
    const current = await this.getNotificationSettings(userId);
    if (!current) {
      // Create default settings if none exist
      const defaultSettings = {
        user_id: userId,
        email_notifications: true,
        push_notifications: true,
        sms_notifications: false,
        item_found_notifications: true,
        item_matched_notifications: true,
        donation_reminders: true
      };
      return await this.createNotificationSettings(defaultSettings);
    }

    // Toggle the specific field
    const currentValue = current[field] as boolean;
    return await this.updateNotificationSettings(userId, { [field]: !currentValue });
  }
}

// Image Upload Service
export class ImageService {
  static async uploadImage(file: File, bucket: string = 'item-images') {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  }

  static async deleteImage(imageUrl: string, bucket: string = 'item-images') {
    // Extract file name from URL
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) throw error;
  }
}

// Audit Log Service
export class AuditService {
  static async logAction(action: {
    user_id?: string;
    action: string;
    details?: unknown;
  }) {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: action.user_id,
        action: action.action,
        details: action.details ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
