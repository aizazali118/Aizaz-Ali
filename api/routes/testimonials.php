<?php

// GET /api/testimonials
if ($method === 'GET' && $uri === '/testimonials') {
    $stmt  = $pdo->query('SELECT * FROM testimonials ORDER BY featured DESC, created_at DESC');
    $items = $stmt->fetchAll();
    foreach ($items as &$item) {
        $item['featured'] = (bool)$item['featured'];
        $item['rating']   = (int)$item['rating'];
    }
    respond($items);
}

// POST /api/testimonials
if ($method === 'POST' && $uri === '/testimonials') {
    require_auth();
    $d    = body();
    $stmt = $pdo->prepare('
        INSERT INTO testimonials (client_name, client_title, company, avatar_url, content, rating, featured)
        VALUES (?,?,?,?,?,?,?)
    ');
    $stmt->execute([
        $d['client_name']  ?? '',
        $d['client_title'] ?? null,
        $d['company']      ?? null,
        $d['avatar_url']   ?? null,
        $d['content']      ?? '',
        $d['rating']       ?? 5,
        empty($d['featured']) ? 0 : 1,
    ]);
    $id   = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM testimonials WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    respond($stmt->fetch(), 201);
}

// PUT /api/testimonials/:id
if ($method === 'PUT' && preg_match('#^/testimonials/(\d+)$#', $uri, $m)) {
    require_auth();
    $id = (int)$m[1];
    $d  = body();
    $pdo->prepare('
        UPDATE testimonials
        SET client_name=?, client_title=?, company=?, avatar_url=?, content=?, rating=?, featured=?
        WHERE id=?
    ')->execute([
        $d['client_name']  ?? '',
        $d['client_title'] ?? null,
        $d['company']      ?? null,
        $d['avatar_url']   ?? null,
        $d['content']      ?? '',
        $d['rating']       ?? 5,
        empty($d['featured']) ? 0 : 1,
        $id,
    ]);
    $stmt = $pdo->prepare('SELECT * FROM testimonials WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $item = $stmt->fetch();
    if (!$item) respond(['error' => 'Not found'], 404);
    respond($item);
}

// DELETE /api/testimonials/:id
if ($method === 'DELETE' && preg_match('#^/testimonials/(\d+)$#', $uri, $m)) {
    require_auth();
    $pdo->prepare('DELETE FROM testimonials WHERE id=?')->execute([(int)$m[1]]);
    respond(['message' => 'Deleted']);
}

respond(['error' => 'Not found'], 404);
