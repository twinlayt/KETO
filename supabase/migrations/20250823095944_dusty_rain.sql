-- Keto Landing Page MySQL Database Setup
-- Run this on your MySQL server

CREATE DATABASE IF NOT EXISTS keto_landing 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE keto_landing;

-- Email Subscribers Table
CREATE TABLE IF NOT EXISTS emails (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    source VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL,
    quiz_answers JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_source (source),
    INDEX idx_timestamp (timestamp),
    INDEX idx_created_at (created_at)
);

-- Site Visitors Table
CREATE TABLE IF NOT EXISTS visitors (
    id VARCHAR(50) PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    user_agent TEXT,
    referrer VARCHAR(500),
    page VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    session_id VARCHAR(100),
    country VARCHAR(2),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_timestamp (timestamp),
    INDEX idx_page (page),
    INDEX idx_ip_address (ip_address),
    INDEX idx_created_at (created_at)
);

-- Site Content Management Table
CREATE TABLE IF NOT EXISTS site_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section VARCHAR(50) NOT NULL UNIQUE,
    content JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_section (section),
    INDEX idx_updated_at (updated_at)
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_is_active (is_active)
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    event_data JSON,
    user_id VARCHAR(50),
    session_id VARCHAR(100),
    ip_address VARCHAR(45),
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_event_type (event_type),
    INDEX idx_timestamp (timestamp),
    INDEX idx_user_id (user_id)
);

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO admin_users (username, password_hash, email) 
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@ketomaster.com');

-- Insert default content
INSERT IGNORE INTO site_content (section, content) VALUES 
('seo', JSON_OBJECT(
    'title', 'Keto Diet Landing Page - Transform Your Life in 30 Days',
    'description', 'Failed at Keto Diet? Get our 30-day guaranteed keto meal list and guides with proven results! 10,000+ people have already transformed their lives.',
    'keywords', 'keto diet, weight loss, meal planning, keto recipes, healthy eating, diet plan, nutrition guide',
    'author', 'KetoMaster',
    'canonical', 'https://yourdomain.com'
)),
('popup', JSON_OBJECT(
    'title', 'Leaving already? 🥺',
    'subtitle', 'Don\'t miss out on keto success! Last chance: Get your Free Keto guide and transform your life in 30 days.',
    'buttonText', 'Use My Last Chance!',
    'dismissText', 'No thanks, let me leave'
)),
('cta', JSON_OBJECT(
    'title', 'Start Today to Succeed in Keto Diet!',
    'subtitle', '10,000+ people have already transformed their lives. Your turn!',
    'buttonText', 'Get It Free Now',
    'guaranteeText', '30-day money back guarantee',
    'noCardText', 'No credit card required',
    'features', JSON_ARRAY(
        '200+ Keto recipes and menus',
        'Weekly shopping lists',
        'WhatsApp support group',
        'Progress tracking tools'
    )
)),
('colors', JSON_OBJECT(
    'primary', '#198754',
    'secondary', '#fd7e14',
    'accent', '#0d6efd',
    'success', '#198754',
    'warning', '#ffc107',
    'error', '#dc3545',
    'background', '#ffffff',
    'surface', '#f8f9fa',
    'text', '#212529',
    'textSecondary', '#6c757d'
));