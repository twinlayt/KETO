# Keto Diet Landing Page

Modern, responsive keto diet landing page built with vanilla HTML/CSS/JavaScript, Bootstrap 5, and MySQL database. Ready for production deployment on your PHP server.

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

**MySQL sunucunuzda:**
```sql
-- 1. MySQL'e bağlanın
mysql -u root -p

-- 2. Database'i oluşturun ve import edin
source database/setup.sql
```

### 2. Configuration

**Sunucunuzda `api/config.php` dosyasını düzenleyin:**
Edit `api/config.php`:
```php
define('DB_HOST', 'localhost');        // MySQL sunucu IP'si
define('DB_NAME', 'keto_landing');
define('DB_USER', 'your_username');    // MySQL kullanıcı adınız
define('DB_PASS', 'your_password');    // MySQL şifreniz
```

### 3. Upload to Server

**Dosyaları sunucunuza yükleyin:**
```bash
# Tüm dosyaları public_html veya www klasörüne yükleyin
# - index.html (ana dosya)
# - css/ klasörü
# - js/ klasörü  
# - api/ klasörü
# - database/ klasörü
```

### 4. Test Installation
```
https://yourdomain.com/          # Ana sayfa
https://yourdomain.com/api/test  # Database test
```

## Admin Access

- **URL**: `https://yourdomain.com/panel` veya `Ctrl+Shift+A`
- **Username**: `admin`
- **Password**: `admin123`

## File Structure

**Production ready structure:**
```
├── index.html              # Ana sayfa
├── panel.html              # Admin panel sayfası
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
├── database/
│   └── setup.sql         # MySQL setup script
└── uploads/              # Resim upload klasörü
```

## API Endpoints

**Production endpoints:**
- `GET /api/test` - Database bağlantı testi
- `GET/POST /api/emails` - Email yönetimi
- `GET/POST /api/visitors` - Ziyaretçi takibi
- `GET/POST /api/content` - İçerik yönetimi
- `GET/POST /api/analytics` - Analytics verisi
- `POST /api/upload` - Resim yükleme

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

**Production security:**
- ✅ SQL injection koruması (PDO prepared statements)
- ✅ XSS koruması (input sanitization)
- ✅ CSRF koruması (token tabanlı)
- ✅ Admin authentication
- ✅ Input validation
- ✅ File upload güvenliği
- ✅ Rate limiting ready

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

## Deployment Instructions

### 1. Sunucuya Yükleme
1. Tüm dosyaları FTP/cPanel ile yükleyin
2. `api/config.php` dosyasında MySQL bilgilerini güncelleyin
3. `database/setup.sql` dosyasını MySQL'de çalıştırın
4. `uploads/` klasörüne yazma izni verin (chmod 755)

### 2. Domain Ayarları
- `api/config.php` içinde domain adresinizi güncelleyin
- `public/sitemap.xml` içinde URL'leri değiştirin
- `public/robots.txt` dosyasını kontrol edin

### 3. Test
- Ana sayfa: `https://yourdomain.com/`
- Database test: `https://yourdomain.com/api/test`
- Admin panel: `https://yourdomain.com/panel`

## Production Ready Features
- 📱 Mobile responsive (Bootstrap 5)
- 🔒 Secure PHP backend
- 💾 MySQL database with indexes
- 📊 Real-time analytics
- 🎨 Admin customization
- 📈 SEO optimized
- 🚀 Fast loading

## License
MIT License