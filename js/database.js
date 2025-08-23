// MySQL Database Integration
class DatabaseManager {
    constructor() {
        this.apiUrl = '/api';
        this.init();
    }

    init() {
        // Initialize database connection
        this.testConnection();
    }

    async testConnection() {
        try {
            const response = await fetch(`${this.apiUrl}/test`);
            if (response.ok) {
                console.log('Database connection successful');
            }
        } catch (error) {
            console.log('Database not connected yet:', error);
        }
    }

    async saveEmail(emailData) {
        try {
            const response = await fetch(`${this.apiUrl}/emails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData)
            });
            
            if (response.ok) {
                console.log('Email saved to database');
                return await response.json();
            }
        } catch (error) {
            console.error('Error saving email:', error);
            // Fallback to localStorage
            this.saveToLocalStorage('keto-emails', emailData);
        }
    }

    async saveVisitor(visitorData) {
        try {
            const response = await fetch(`${this.apiUrl}/visitors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(visitorData)
            });
            
            if (response.ok) {
                console.log('Visitor saved to database');
                return await response.json();
            }
        } catch (error) {
            console.error('Error saving visitor:', error);
            // Fallback to localStorage
            this.saveToLocalStorage('keto-visitors', visitorData);
        }
    }

    async getEmails() {
        try {
            const response = await fetch(`${this.apiUrl}/emails`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching emails:', error);
            // Fallback to localStorage
            return JSON.parse(localStorage.getItem('keto-emails') || '[]');
        }
    }

    async getVisitors() {
        try {
            const response = await fetch(`${this.apiUrl}/visitors`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching visitors:', error);
            // Fallback to localStorage
            return JSON.parse(localStorage.getItem('keto-visitors') || '[]');
        }
    }

    async deleteEmail(id) {
        try {
            const response = await fetch(`${this.apiUrl}/emails/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                console.log('Email deleted from database');
                return true;
            }
        } catch (error) {
            console.error('Error deleting email:', error);
            // Fallback to localStorage
            const emails = JSON.parse(localStorage.getItem('keto-emails') || '[]');
            const filtered = emails.filter(email => email.id !== id);
            localStorage.setItem('keto-emails', JSON.stringify(filtered));
            return true;
        }
    }

    saveToLocalStorage(key, data) {
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.unshift(data);
        localStorage.setItem(key, JSON.stringify(existing.slice(0, 1000)));
    }

    // MySQL Schema for reference
    getSchema() {
        return {
            emails: `
                CREATE TABLE IF NOT EXISTS emails (
                    id VARCHAR(50) PRIMARY KEY,
                    email VARCHAR(255) NOT NULL,
                    source VARCHAR(50) NOT NULL,
                    timestamp DATETIME NOT NULL,
                    quiz_answers JSON,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_email (email),
                    INDEX idx_source (source),
                    INDEX idx_timestamp (timestamp)
                );
            `,
            visitors: `
                CREATE TABLE IF NOT EXISTS visitors (
                    id VARCHAR(50) PRIMARY KEY,
                    timestamp DATETIME NOT NULL,
                    user_agent TEXT,
                    referrer VARCHAR(500),
                    page VARCHAR(255),
                    ip_address VARCHAR(45),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_timestamp (timestamp),
                    INDEX idx_page (page)
                );
            `,
            content: `
                CREATE TABLE IF NOT EXISTS site_content (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    section VARCHAR(50) NOT NULL,
                    content JSON NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    UNIQUE KEY unique_section (section)
                );
            `
        };
    }
}

// Initialize database manager
document.addEventListener('DOMContentLoaded', () => {
    window.dbManager = new DatabaseManager();
});