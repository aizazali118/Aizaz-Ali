<?php

// POST /api/auth/login
if ($method === 'POST' && $uri === '/auth/login') {
    $d        = body();
    $email    = strtolower(trim($d['email'] ?? ''));
    $password = $d['password'] ?? '';

    if (!$email || !$password) {
        respond(['error' => 'Email and password required'], 400);
    }

    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        respond(['error' => 'Invalid credentials'], 401);
    }

    $token = jwt_encode(['id' => $user['id'], 'email' => $user['email']]);
    $admin = ['id' => $user['id'], 'email' => $user['email'], 'name' => $user['name']];
    respond(['token' => $token, 'admin' => $admin]);
}

// GET /api/auth/me
if ($method === 'GET' && $uri === '/auth/me') {
    $auth_user = require_auth();
    $stmt = $pdo->prepare('SELECT id, email, name FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$auth_user['id']]);
    $user = $stmt->fetch();
    if (!$user) respond(['error' => 'User not found'], 404);
    respond(['admin' => $user]);
}

// PUT /api/auth/password — change password
if ($method === 'PUT' && $uri === '/auth/password') {
    $auth_user = require_auth();
    $d = body();
    $current  = $d['current_password'] ?? '';
    $newpass  = $d['new_password']     ?? '';
    if (!$current || !$newpass) respond(['error' => 'Both fields required'], 400);
    if (strlen($newpass) < 6) respond(['error' => 'New password must be at least 6 characters'], 400);

    $stmt = $pdo->prepare('SELECT password FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$auth_user['id']]);
    $user = $stmt->fetch();
    if (!$user || !password_verify($current, $user['password'])) {
        respond(['error' => 'Current password is incorrect'], 401);
    }
    $hash = password_hash($newpass, PASSWORD_DEFAULT);
    $pdo->prepare('UPDATE users SET password = ? WHERE id = ?')->execute([$hash, $auth_user['id']]);
    respond(['message' => 'Password updated successfully']);
}

respond(['error' => 'Not found'], 404);
