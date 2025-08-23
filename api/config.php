<?php
// PHP Version Check
if (version_compare(PHP_VERSION, '7.4.0') < 0) {
    die('PHP 7.4 or higher is required. Current version: ' . PHP_VERSION);
}

// Error Reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Session Configuration
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database Configuration
// SUNUCUNUZDA BU BİLGİLERİ GÜNCELLEYİN:
define('DB_HOST', 'localhost');           // MySQL sunucu adresi (genellikle localhost)
define('DB_NAME', 'keto_landing');        // Veritabanı adı
define('DB_USER', 'your_mysql_username'); // cPanel MySQL kullanıcı adınız
define('DB_PASS', 'your_mysql_password'); // cPanel MySQL şifreniz
define('DB_PORT', '3306');                // MySQL port (genellikle 3306)

// Site Configuration
define('SITE_URL', 'https://yourdomain.com'); // Kendi domain adresiniz
define('UPLOAD_PATH', __DIR__ . '/../uploads/');
define('UPLOAD_URL', '/uploads/');

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Connection
function getDBConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        error_log('Database connection error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'error' => 'Database connection failed',
            'details' => $e->getMessage(),
            'php_version' => PHP_VERSION
        ]);
        exit();
    }
}

// Utility Functions
function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

function sendError($message, $status = 400) {
    http_response_code($status);
    echo json_encode(['error' => $message]);
    exit();
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}
?>