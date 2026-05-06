<?php
/**
 * Run this ONCE in your browser: https://aizazaliafridi.com/api/setup.php
 * Then DELETE this file immediately from Hostinger File Manager!
 */
require __DIR__ . '/config/database.php';

$email    = 'aizaz.visiontact@gmail.com';
$password = 'Aizaz@Admin2025!';
$name     = 'Aizaz Ali';
$hash     = password_hash($password, PASSWORD_BCRYPT);

$stmt = $pdo->prepare('
    INSERT INTO users (email, password, name)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE password = VALUES(password), name = VALUES(name)
');
$stmt->execute([$email, $hash, $name]);

header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'message' => 'Admin user created successfully. DELETE THIS FILE NOW from Hostinger File Manager!',
    'email'   => $email,
]);
