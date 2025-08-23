<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        getContent($pdo);
        break;
    case 'POST':
        saveContent($pdo);
        break;
    default:
        sendError('Method not allowed', 405);
}

function getContent($pdo) {
    try {
        $stmt = $pdo->query("SELECT section, content FROM site_content");
        $rows = $stmt->fetchAll();
        
        $content = [];
        foreach ($rows as $row) {
            $content[$row['section']] = json_decode($row['content'], true);
        }
        
        sendResponse($content);
    } catch (PDOException $e) {
        sendError('Error fetching content: ' . $e->getMessage(), 500);
    }
}

function saveContent($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['section']) || !isset($input['content'])) {
        sendError('Missing required fields');
    }
    
    $section = sanitizeInput($input['section']);
    $content = json_encode($input['content']);
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO site_content (section, content) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE content = VALUES(content), updated_at = CURRENT_TIMESTAMP
        ");
        
        $stmt->execute([$section, $content]);
        
        sendResponse([
            'success' => true,
            'message' => 'Content saved successfully'
        ]);
    } catch (PDOException $e) {
        sendError('Error saving content: ' . $e->getMessage(), 500);
    }
}
?>