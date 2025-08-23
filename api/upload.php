<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

// Check if file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    sendError('No file uploaded or upload error');
}

$file = $_FILES['image'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$maxSize = 5 * 1024 * 1024; // 5MB

// Validate file type
if (!in_array($file['type'], $allowedTypes)) {
    sendError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
}

// Validate file size
if ($file['size'] > $maxSize) {
    sendError('File too large. Maximum size is 5MB.');
}

// Create uploads directory if it doesn't exist
$uploadDir = '../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid() . '_' . time() . '.' . $extension;
$filepath = $uploadDir . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $filepath)) {
    $publicUrl = '/uploads/' . $filename;
    
    sendResponse([
        'success' => true,
        'url' => $publicUrl,
        'filename' => $filename,
        'message' => 'File uploaded successfully'
    ]);
} else {
    sendError('Failed to save uploaded file', 500);
}
?>