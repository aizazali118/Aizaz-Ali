<?php
function require_auth(): array {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!$auth || substr($auth, 0, 7) !== 'Bearer ') {
        respond(['error' => 'Unauthorized'], 401);
    }
    $token = substr($auth, 7);
    try {
        return jwt_decode($token);
    } catch (Exception $e) {
        respond(['error' => 'Invalid or expired token'], 401);
    }
}
