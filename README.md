# Keto Diet Landing Page

Modern, responsive keto diet landing page built with vanilla HTML/CSS/JavaScript, Bootstrap 5, and MySQL database.

## Features

### 🎯 Landing Page
- **Responsive Design** - Bootstrap 5 ile mobil uyumlu
- **Interactive Quiz** - Kişiselleştirilmiş keto planı
- **Email Collection** - Çoklu kaynak takibi
- **Exit Intent Popup** - Kullanıcı kaybını önleme
- **Sticky Email Bar** - Scroll tabanlı email toplama
- **Success Stories** - Sosyal kanıt testimonials

### 🔧 Admin Panel
- **Email Management** - Abone listesi yönetimi
- **Visitor Tracking** - Site ziyaretçi analizi
- **Content Management** - Tüm içerik düzenleme
- **SEO Settings** - Meta tag yönetimi
- **Color Customization** - Site renk düzenleme
- **Popup Management** - Exit intent popup kontrolü
- **Image Upload** - Local resim yükleme
- **CSV Export** - Veri dışa aktarma

### 💾 Database (MySQL)
- **Email Subscribers** - Quiz cevapları ile
- **Site Visitors** - User agent, referrer tracking
- **Content Management** - JSON tabanlı içerik
- **Analytics** - Event tracking
- **Admin Users** - Güvenli giriş sistemi

## Setup

### 1. Database Setup
```sql
-- Create database
CREATE DATABASE keto_landing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Import schema
mysql -u root -p keto_landing < database/schema.sql
```

### 2. Configuration
Edit `api/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'keto_landing');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

### 3. Start Server
```bash
npm run dev
# or
php -S localhost:8000
```

## Admin Access

- **URL**: `/panel` veya `Ctrl+Shift+A`
- **Username**: `admin`
- **Password**: `admin123`

## File Structure

```
├── index.html              # Ana sayfa
├── css/
│   └── style.css          # Custom CSS
├── js/
│   ├── app.js            # Ana uygulama
│   ├── admin.js          # Admin panel
│   └── database.js       # Database yönetimi
├── api/
│   ├── config.php        # Database config
│   ├── index.php         # API router
│   ├── emails.php        # Email endpoints
│   ├── visitors.php      # Visitor endpoints
│   ├── content.php       # Content endpoints
│   └── analytics.php     # Analytics endpoints
└── database/
    └── schema.sql        # MySQL schema
```

## API Endpoints

- `GET /api/test` - Database connection test
- `GET/POST /api/emails` - Email management
- `GET/POST /api/visitors` - Visitor tracking
- `GET/POST /api/content` - Content management
- `GET/POST /api/analytics` - Analytics data

## Features

### Email Collection Sources
- **Hero Section** - Ana banner CTA
- **Quiz Completion** - Quiz sonucu
- **Exit Intent** - Sayfa terk popup
- **Sticky Bar** - Scroll tabanlı
- **CTA Section** - Alt bölüm
- **Testimonials** - Başarı hikayeleri

### Admin Panel Tabs
1. **Email Aboneleri** - Liste, arama, CSV export
2. **Site Ziyaretçileri** - Analiz, istatistikler
3. **Ana İçerik** - Hero, stats, testimonials
4. **SEO Ayarları** - Meta tags, canonical
5. **Navbar** - Logo ve menü
6. **Quiz Yönetimi** - Sorular ve seçenekler
7. **Özellikler** - "What's Included?" bölümü
8. **CTA Bölümü** - Garanti metinleri dahil
9. **Popup Yönetimi** - Exit intent popup
10. **Renk Düzenleme** - Site renk şeması
11. **404 Sayfası** - Hata sayfası içeriği

## Security

- SQL injection koruması (PDO prepared statements)
- XSS koruması (input sanitization)
- CSRF koruması (token tabanlı)
- Admin authentication
- Input validation

## Performance

- Optimized MySQL indexes
- Lazy loading images
- Minified CSS/JS (production)
- CDN kullanımı (Bootstrap, icons)
- Local storage fallback

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License