<?php
require_once 'config.php';

// Simple routing
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
$path = str_replace('/api', '', $path);

switch ($path) {
    case '/test':
        testConnection();
        break;
    case '/emails':
        require 'emails.php';
        break;
    case '/visitors':
        require 'visitors.php';
        break;
    case '/content':
        require 'content.php';
        break;
    case '/analytics':
        require 'analytics.php';
        break;
    default:
        sendError('Endpoint not found', 404);
}

function testConnection() {
    try {
        $pdo = getDBConnection();
        sendResponse([
            'status' => 'connected',
            'message' => 'Database connection successful',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    } catch (Exception $e) {
        sendError('Database connection failed: ' . $e->getMessage(), 500);
    }
}
?>