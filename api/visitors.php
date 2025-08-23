<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        getVisitors($pdo);
        break;
    case 'POST':
        saveVisitor($pdo);
        break;
    default:
        sendError('Method not allowed', 405);
}

function getVisitors($pdo) {
    try {
        $stmt = $pdo->query("
            SELECT id, timestamp, user_agent, referrer, page, ip_address, created_at 
            FROM visitors 
            ORDER BY created_at DESC 
            LIMIT 1000
        ");
        $visitors = $stmt->fetchAll();
        
        sendResponse($visitors);
    } catch (PDOException $e) {
        sendError('Error fetching visitors: ' . $e->getMessage(), 500);
    }
}

function saveVisitor($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['timestamp']) || !isset($input['page'])) {
        sendError('Missing required fields');
    }
    
    $id = $input['id'] ?? uniqid();
    $timestamp = $input['timestamp'];
    $userAgent = $input['userAgent'] ?? '';
    $referrer = $input['referrer'] ?? '';
    $page = sanitizeInput($input['page']);
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO visitors (id, timestamp, user_agent, referrer, page, ip_address) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([$id, $timestamp, $userAgent, $referrer, $page, $ipAddress]);
        
        sendResponse([
            'success' => true,
            'id' => $id,
            'message' => 'Visitor saved successfully'
        ]);
    } catch (PDOException $e) {
        sendError('Error saving visitor: ' . $e->getMessage(), 500);
    }
}
?>