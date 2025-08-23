<?php
require_once 'config.php';

// Database Connection Test
function testDatabaseConnection() {
    try {
        $pdo = getDBConnection();
        
        // Test basic query
        $stmt = $pdo->query("SELECT 1 as test");
        $result = $stmt->fetch();
        
        // Check if tables exist
        $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        
        return [
            'status' => 'success',
            'message' => 'Database connection successful',
            'php_version' => PHP_VERSION,
            'mysql_version' => $pdo->getAttribute(PDO::ATTR_SERVER_VERSION),
            'database' => DB_NAME,
            'tables_found' => count($tables),
            'tables' => $tables,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    } catch (Exception $e) {
        return [
            'status' => 'error',
            'message' => 'Database connection failed',
            'error' => $e->getMessage(),
            'php_version' => PHP_VERSION,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
}

// System Information
function getSystemInfo() {
    return [
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
        'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'Unknown',
        'extensions' => [
            'pdo' => extension_loaded('pdo'),
            'pdo_mysql' => extension_loaded('pdo_mysql'),
            'json' => extension_loaded('json'),
            'mbstring' => extension_loaded('mbstring'),
            'curl' => extension_loaded('curl')
        ]
    ];
}

// Main test
$dbTest = testDatabaseConnection();
$sysInfo = getSystemInfo();

sendResponse([
    'database' => $dbTest,
    'system' => $sysInfo
]);
?>