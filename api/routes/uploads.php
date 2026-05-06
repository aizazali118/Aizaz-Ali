<?php

define('UPLOAD_DIR', ROOT . '/uploads/');
define('UPLOAD_URL', '/api/uploads/');
define('MAX_SIZE',   10 * 1024 * 1024); // 10 MB

// POST /api/uploads/image
if ($method === 'POST' && $uri === '/uploads/image') {
    require_auth();

    if (empty($_FILES['image'])) {
        respond(['error' => 'No image provided'], 400);
    }

    $file    = $_FILES['image'];
    $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

    if (!in_array($file['type'], $allowed, true)) {
        respond(['error' => 'Only JPG, PNG, GIF, WEBP, SVG allowed'], 400);
    }
    if ($file['size'] > MAX_SIZE) {
        respond(['error' => 'File exceeds 10 MB'], 400);
    }

    $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $name = uniqid('img_', true) . '.' . $ext;
    $dir  = UPLOAD_DIR . 'images/';

    if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
        respond(['error' => 'Could not create upload directory'], 500);
    }

    if (!move_uploaded_file($file['tmp_name'], $dir . $name)) {
        respond(['error' => 'Upload failed'], 500);
    }

    respond(['url' => UPLOAD_URL . 'images/' . $name]);
}

// POST /api/uploads/download/:postId
if ($method === 'POST' && preg_match('#^/uploads/download/(\d+)$#', $uri, $m)) {
    require_auth();
    $postId = (int)$m[1];

    if (empty($_FILES['file'])) {
        respond(['error' => 'No file provided'], 400);
    }

    $file  = $_FILES['file'];
    $label = $_POST['label'] ?? $file['name'];
    $ext   = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $name  = uniqid('dl_', true) . '.' . $ext;
    $dir   = UPLOAD_DIR . 'downloads/';

    if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
        respond(['error' => 'Could not create upload directory'], 500);
    }

    if (!move_uploaded_file($file['tmp_name'], $dir . $name)) {
        respond(['error' => 'Upload failed'], 500);
    }

    $path = UPLOAD_URL . 'downloads/' . $name;

    $stmt = $pdo->prepare('
        INSERT INTO downloads (post_id, label, file_path, file_name, file_size)
        VALUES (?,?,?,?,?)
    ');
    $stmt->execute([$postId, $label, $path, $file['name'], $file['size']]);

    $id   = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM downloads WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    respond($stmt->fetch(), 201);
}

// DELETE /api/uploads/download/:id
if ($method === 'DELETE' && preg_match('#^/uploads/download/(\d+)$#', $uri, $m)) {
    require_auth();
    $id   = (int)$m[1];
    $stmt = $pdo->prepare('SELECT * FROM downloads WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $dl = $stmt->fetch();

    if ($dl) {
        $disk = ROOT . str_replace('/api/uploads', '/uploads', $dl['file_path']);
        if (file_exists($disk)) @unlink($disk);
        $pdo->prepare('DELETE FROM downloads WHERE id=?')->execute([$id]);
    }

    respond(['message' => 'Deleted']);
}

respond(['error' => 'Not found'], 404);
