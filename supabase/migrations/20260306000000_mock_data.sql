-- Mock Data Migration
-- Populates the database with sample lost and found items

-- Insert sample schools
INSERT INTO schools (id, name, code, address, city, state, zip_code, created_at, updated_at) VALUES
('school-1', 'Lincoln High School', 'LHS001', '123 Main Street', 'Springfield', 'IL', '62701', NOW(), NOW()),
('school-2', 'Washington Middle School', 'WMS002', '456 Oak Avenue', 'Springfield', 'IL', '62702', NOW(), NOW()),
('school-3', 'Roosevelt Elementary', 'RES003', '789 Pine Road', 'Springfield', 'IL', '62703', NOW(), NOW());

-- Insert sample users
INSERT INTO users (id, email, full_name, role, school_id, student_id, grade, auth_id, created_at, updated_at) VALUES
('user-1', 'john.doe@example.com', 'John Doe', 'student', 'school-1', 'STU001', '11', 'auth-user-1', NOW(), NOW()),
('user-2', 'jane.smith@example.com', 'Jane Smith', 'student', 'school-1', 'STU002', '10', 'auth-user-2', NOW(), NOW()),
('user-3', 'mike.johnson@example.com', 'Mike Johnson', 'student', 'school-2', 'STU003', '9', 'auth-user-3', NOW(), NOW()),
('user-4', 'sarah.williams@example.com', 'Sarah Williams', 'student', 'school-2', 'STU004', '12', 'auth-user-4', NOW(), NOW()),
('user-5', 'admin@school.edu', 'School Administrator', 'admin', 'school-1', NULL, NULL, 'auth-admin-1', NOW(), NOW());

-- Insert notification settings for users
INSERT INTO notification_settings (id, user_id, email_notifications, push_notifications, sms_notifications, item_found_notifications, item_matched_notifications, donation_reminders, created_at, updated_at) VALUES
('notif-1', 'user-1', true, true, false, true, true, true, NOW(), NOW()),
('notif-2', 'user-2', true, true, false, true, true, true, NOW(), NOW()),
('notif-3', 'user-3', true, true, false, true, true, true, NOW(), NOW()),
('notif-4', 'user-4', true, true, false, true, true, true, NOW(), NOW()),
('notif-5', 'user-5', true, true, false, true, true, true, NOW(), NOW());

-- Insert sample lost items
INSERT INTO lost_items (id, user_id, title, description, location, category, status, image_url, created_at, updated_at) VALUES
('lost-1', 'user-1', 'Black North Face Backpack', 'Black North Face backpack with laptop compartment. Contains textbooks and notebooks.', 'Library - Second Floor', 'Backpack', 'active', 'https://images.unsplash.com/photo-1553062407-02eeab2485db?w=400&h=300&fit=crop', NOW(), NOW()),
('lost-2', 'user-2', 'Silver iPhone 13', 'Silver iPhone 13 with blue case. Has a cracked screen protector.', 'Cafeteria - Table 12', 'Electronics', 'active', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop', NOW(), NOW()),
('lost-3', 'user-3', 'Blue Water Bottle', 'Blue Hydro Flask water bottle with stickers. 32oz size.', 'Gymnasium - Bleachers', 'Water Bottle', 'active', 'https://images.unsplash.com/photo-1602143407391-608e530a732a?w=400&h=300&fit=crop', NOW(), NOW()),
('lost-4', 'user-4', 'Math Textbook', 'Algebra II textbook with name "Sarah Williams" written inside.', 'Math Classroom - Room 204', 'Books', 'active', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop', NOW(), NOW()),
('lost-5', 'user-1', 'Car Keys', 'Toyota car keys with red keychain. Has a small silver key attached.', 'Parking Lot - Section B', 'Keys', 'active', 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop', NOW(), NOW()),
('lost-6', 'user-2', 'Black Hoodie', 'Black Nike hoodie with white logo. Size Medium.', 'Auditorium - Back Row', 'Clothing', 'active', 'https://images.unsplash.com/photo-1556821840-3a63f9560941?w=400&h=300&fit=crop', NOW(), NOW()),
('lost-7', 'user-3', 'Wireless Earbuds', 'White Apple AirPods with charging case. Left earbud has a small scratch.', 'Science Lab - Station 3', 'Electronics', 'active', 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&h=300&fit=crop', NOW(), NOW()),
('lost-8', 'user-4', 'Sunglasses', 'Ray-Ban sunglasses with black frames. Polarized lenses.', 'Football Field - Sideline', 'Accessories', 'active', 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=300&fit=crop', NOW(), NOW()),
('lost-9', 'user-1', 'Laptop Charger', 'MacBook Pro charger with USB-C connector. 87W power adapter.', 'Study Hall - Table 5', 'Electronics', 'active', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop', NOW(), NOW()),
('lost-10', 'user-2', 'Jansport Backpack', 'Gray Jansport backpack with pink accents. Contains notebooks and pens.', 'Bus Stop - Main Entrance', 'Backpack', 'active', 'https://images.unsplash.com/photo-1553062407-02eeab2485db?w=400&h=300&fit=crop', NOW(), NOW());

-- Insert sample found items
INSERT INTO found_items (id, finder_id, title, description, location_found, storage_location, category, status, image_url, found_time, created_at, updated_at) VALUES
('found-1', 'user-5', 'Red Wallet', 'Leather wallet containing student ID and credit cards. Owner name visible.', 'Hallway - Near Principal Office', 'Main Office', 'Wallet', 'active', 'https://images.unsplash.com/photo-1565404962518-8e2d8b5b3c7c?w=400&h=300&fit=crop', '2024-03-05 10:30:00', NOW(), NOW()),
('found-2', 'user-5', 'Blue Notebook', 'Spiral notebook with math notes. Has "Chemistry Notes" written on cover.', 'Chemistry Lab - Station 7', 'Lost and Found', 'Books', 'active', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop', '2024-03-05 11:15:00', NOW(), NOW()),
('found-3', 'user-5', 'Silver Watch', 'Timex digital watch with black band. Still working.', 'Gym Locker Room', 'Coach Office', 'Accessories', 'active', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', '2024-03-05 12:00:00', NOW(), NOW()),
('found-4', 'user-5', 'Black Umbrella', 'Large black umbrella with wooden handle. Slightly bent.', 'Main Entrance - Coat Rack', 'Front Desk', 'Accessories', 'active', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', '2024-03-05 09:45:00', NOW(), NOW()),
('found-5', 'user-5', 'White Headphones', 'Over-ear headphones with white padding. 3.5mm jack.', 'Library - Study Room 2', 'Library Desk', 'Electronics', 'active', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', '2024-03-05 14:20:00', NOW(), NOW()),
('found-6', 'user-5', 'Green Water Bottle', 'Green plastic water bottle with sports cap. 24oz.', 'Basketball Court', 'PE Office', 'Water Bottle', 'active', 'https://images.unsplash.com/photo-1602143407391-608e530a732a?w=400&h=300&fit=crop', '2024-03-05 15:30:00', NOW(), NOW()),
('found-7', 'user-5', 'Brown Leather Belt', 'Brown leather belt with silver buckle. Size 32.', 'Restroom - Near Sinks', 'Janitor Closet', 'Accessories', 'active', 'https://images.unsplash.com/photo-1598635314672-7a2c8300a07e?w=400&h=300&fit=crop', '2024-03-05 16:15:00', NOW(), NOW()),
('found-8', 'user-5', 'Purple Phone Case', 'Purple silicone phone case with flower pattern. Fits iPhone 12.', 'Art Room - Table 3', 'Art Department', 'Accessories', 'active', 'https://images.unsplash.com/photo-1596462502278-27d54b927f36?w=400&h=300&fit=crop', '2024-03-05 13:00:00', NOW(), NOW()),
('found-9', 'user-5', 'Black Baseball Cap', 'Black baseball cap with white "LHS" logo. Adjustable strap.', 'Football Field - Bleachers', 'Athletic Office', 'Accessories', 'active', 'https://images.unsplash.com/photo-1574180531300-3bf0d8b4d9a2?w=400&h=300&fit=crop', '2024-03-05 17:00:00', NOW(), NOW()),
('found-10', 'user-5', 'Set of Keys', 'Multiple keys on a silver keychain. Includes house key and car key.', 'Parking Lot - Near Gate', 'Security Office', 'Keys', 'active', 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop', '2024-03-05 08:30:00', NOW(), NOW());

-- Insert sample item matches (potential matches between lost and found items)
INSERT INTO item_matches (id, lost_item_id, found_item_id, confidence_score, status, created_at, updated_at) VALUES
('match-1', 'lost-2', 'found-8', 0.85, 'pending', NOW(), NOW()),
('match-2', 'lost-5', 'found-10', 0.92, 'pending', NOW(), NOW()),
('match-3', 'lost-7', 'found-5', 0.78, 'pending', NOW(), NOW()),
('match-4', 'lost-3', 'found-6', 0.88, 'pending', NOW(), NOW()),
('match-5', 'lost-8', 'found-9', 0.75, 'pending', NOW(), NOW());

-- Insert sample claims
INSERT INTO claims (id, listing_id, claimant_id, status, created_at, updated_at) VALUES
('claim-1', 'lost-1', 'user-2', 'submitted', NOW(), NOW()),
('claim-2', 'found-1', 'user-1', 'submitted', NOW(), NOW()),
('claim-3', 'lost-4', 'user-3', 'approved', NOW(), NOW()),
('claim-4', 'found-3', 'user-4', 'submitted', NOW(), NOW()),
('claim-5', 'lost-6', 'user-5', 'rejected', NOW(), NOW());

-- Insert sample audit logs
INSERT INTO audit_logs (id, user_id, action, table_name, record_id, old_values, new_values, created_at) VALUES
('audit-1', 'user-1', 'INSERT', 'lost_items', 'lost-1', NULL, '{"title": "Black North Face Backpack", "status": "active"}', NOW()),
('audit-2', 'user-2', 'INSERT', 'lost_items', 'lost-2', NULL, '{"title": "Silver iPhone 13", "status": "active"}', NOW()),
('audit-3', 'user-5', 'INSERT', 'found_items', 'found-1', NULL, '{"title": "Red Wallet", "status": "active"}', NOW()),
('audit-4', 'user-2', 'INSERT', 'claims', 'claim-1', NULL, '{"listing_id": "lost-1", "status": "submitted"}', NOW()),
('audit-5', 'user-5', 'UPDATE', 'claims', 'claim-3', '{"status": "submitted"}', '{"status": "approved"}', NOW());
