<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        getAnalytics($pdo);
        break;
    case 'POST':
        saveAnalytics($pdo);
        break;
    default:
        sendError('Method not allowed', 405);
}

function getAnalytics($pdo) {
    try {
        // Get email statistics
        $emailStats = $pdo->query("
            SELECT 
                source,
                COUNT(*) as count,
                DATE(created_at) as date
            FROM emails 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY source, DATE(created_at)
            ORDER BY date DESC
        ")->fetchAll();

        // Get visitor statistics
        $visitorStats = $pdo->query("
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as count,
                COUNT(DISTINCT ip_address) as unique_visitors
            FROM visitors 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        ")->fetchAll();

        // Get top pages
        $topPages = $pdo->query("
            SELECT 
                page,
                COUNT(*) as visits
            FROM visitors 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY page
            ORDER BY visits DESC
            LIMIT 10
        ")->fetchAll();

        // Get referrer statistics
        $referrers = $pdo->query("
            SELECT 
                referrer,
                COUNT(*) as count
            FROM visitors 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            AND referrer != 'Direct'
            GROUP BY referrer
            ORDER BY count DESC
            LIMIT 10
        ")->fetchAll();

        sendResponse([
            'emails' => $emailStats,
            'visitors' => $visitorStats,
            'topPages' => $topPages,
            'referrers' => $referrers
        ]);
    } catch (PDOException $e) {
        sendError('Error fetching analytics: ' . $e->getMessage(), 500);
    }
}

function saveAnalytics($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['event_type'])) {
        sendError('Missing required fields');
    }
    
    $eventType = sanitizeInput($input['event_type']);
    $eventData = isset($input['event_data']) ? json_encode($input['event_data']) : null;
    $userId = $input['user_id'] ?? null;
    $sessionId = $input['session_id'] ?? session_id();
    $timestamp = $input['timestamp'] ?? date('Y-m-d H:i:s');
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO analytics (event_type, event_data, user_id, session_id, ip_address, timestamp) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([$eventType, $eventData, $userId, $sessionId, $ipAddress, $timestamp]);
        
        sendResponse([
            'success' => true,
            'message' => 'Analytics saved successfully'
        ]);
    } catch (PDOException $e) {
        sendError('Error saving analytics: ' . $e->getMessage(), 500);
    }
}
?>