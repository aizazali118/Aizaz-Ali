<?php
declare(strict_types=1);

define('ROOT', __DIR__);

// ── CORS headers ──────────────────────────────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ── Load core files ───────────────────────────────────────────
require ROOT . '/config/database.php';
require ROOT . '/helpers/jwt.php';
require ROOT . '/helpers/response.php';
require ROOT . '/middleware/auth.php';

// ── Parse URI (strip /api prefix) ────────────────────────────
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = preg_replace('#^/api#', '', $uri);
$uri    = rtrim($uri, '/') ?: '/';
$method = $_SERVER['REQUEST_METHOD'];

// ── Route dispatch ────────────────────────────────────────────
if (preg_match('#^/auth#', $uri)) {
    require ROOT . '/routes/auth.php';
} elseif (preg_match('#^/posts#', $uri)) {
    require ROOT . '/routes/posts.php';
} elseif (preg_match('#^/portfolio#', $uri)) {
    require ROOT . '/routes/portfolio.php';
} elseif (preg_match('#^/siteservices#', $uri)) {
    require ROOT . '/routes/siteservices.php';
} elseif (preg_match('#^/testimonials#', $uri)) {
    require ROOT . '/routes/testimonials.php';
} elseif (preg_match('#^/uploads#', $uri)) {
    require ROOT . '/routes/uploads.php';
} elseif ($uri === '/health') {
    respond(['status' => 'ok', 'timestamp' => date('c'), 'php' => PHP_VERSION]);
} else {
    respond(['error' => 'Route not found'], 404);
}
