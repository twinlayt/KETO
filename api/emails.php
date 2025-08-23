<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        getEmails($pdo);
        break;
    case 'POST':
        saveEmail($pdo);
        break;
    case 'DELETE':
        deleteEmail($pdo);
        break;
    default:
        sendError('Method not allowed', 405);
}

function getEmails($pdo) {
    try {
        $stmt = $pdo->query("
            SELECT id, email, source, timestamp, quiz_answers, created_at 
            FROM emails 
            ORDER BY created_at DESC 
            LIMIT 1000
        ");
        $emails = $stmt->fetchAll();
        
        // Convert quiz_answers JSON back to array
        foreach ($emails as &$email) {
            if ($email['quiz_answers']) {
                $email['quiz_answers'] = json_decode($email['quiz_answers'], true);
            }
        }
        
        sendResponse($emails);
    } catch (PDOException $e) {
        sendError('Error fetching emails: ' . $e->getMessage(), 500);
    }
}

function saveEmail($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['email']) || !isset($input['source'])) {
        sendError('Missing required fields');
    }
    
    $email = sanitizeInput($input['email']);
    $source = sanitizeInput($input['source']);
    $timestamp = $input['timestamp'] ?? date('Y-m-d H:i:s');
    $quizAnswers = isset($input['quizAnswers']) ? json_encode($input['quizAnswers']) : null;
    
    if (!validateEmail($email)) {
        sendError('Invalid email format');
    }
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO emails (id, email, source, timestamp, quiz_answers) 
            VALUES (?, ?, ?, ?, ?)
        ");
        
        $id = $input['id'] ?? uniqid();
        $stmt->execute([$id, $email, $source, $timestamp, $quizAnswers]);
        
        sendResponse([
            'success' => true,
            'id' => $id,
            'message' => 'Email saved successfully'
        ]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) { // Duplicate entry
            sendError('Email already exists');
        } else {
            sendError('Error saving email: ' . $e->getMessage(), 500);
        }
    }
}

function deleteEmail($pdo) {
    $pathInfo = $_SERVER['PATH_INFO'] ?? '';
    $id = trim($pathInfo, '/');
    
    if (!$id) {
        sendError('Email ID required');
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM emails WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() > 0) {
            sendResponse(['success' => true, 'message' => 'Email deleted successfully']);
        } else {
            sendError('Email not found', 404);
        }
    } catch (PDOException $e) {
        sendError('Error deleting email: ' . $e->getMessage(), 500);
    }
}
?>