@@ .. @@
--- Keto Landing Page MySQL Database Setup
--- Run this on your MySQL server
+-- Keto Landing Page MySQL Database Setup
+-- Minimum PHP 7.4, MySQL 5.7+ required
 
-CREATE DATABASE IF NOT EXISTS keto_landing 
+-- Create database with proper charset
+CREATE DATABASE IF NOT EXISTS keto_landing
 CHARACTER SET utf8mb4 
 COLLATE utf8mb4_unicode_ci;
 
@@ .. @@
 -- Insert default admin user (password: admin123)
+-- Password hash for 'admin123'
 INSERT IGNORE INTO admin_users (username, password_hash, email) 
-VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@ketomaster.com');
+VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@yourdomain.com');
 
 -- Insert default content
 INSERT IGNORE INTO site_content (section, content) VALUES 
@@ .. @@
     'canonical', 'https://yourdomain.com'
 )),
+-- Default popup content
 ('popup', JSON_OBJECT(
@@ .. @@
     'dismissText', 'No thanks, let me leave'
 )),
+-- Default CTA content with guarantee text
 ('cta', JSON_OBJECT(
@@ .. @@
     'textSecondary', '#6c757d'
 ));
+
+-- Show success message
+SELECT 'Database setup completed successfully!' as message;
+SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'keto_landing';