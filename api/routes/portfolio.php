<?php

function portfolio_decode(array $item): array {
    $item['tags']     = $item['tags'] ? json_decode($item['tags'], true) : [];
    $item['featured'] = (bool)$item['featured'];
    return $item;
}

// GET /api/portfolio
if ($method === 'GET' && $uri === '/portfolio') {
    $stmt  = $pdo->query('SELECT * FROM portfolio_items ORDER BY featured DESC, sort_order ASC, created_at DESC');
    $items = array_map('portfolio_decode', $stmt->fetchAll());
    respond($items);
}

// POST /api/portfolio
if ($method === 'POST' && $uri === '/portfolio') {
    require_auth();
    $d    = body();
    $tags = json_encode(is_array($d['tags'] ?? null) ? $d['tags'] : []);
    $stmt = $pdo->prepare('
        INSERT INTO portfolio_items (title, category, image_url, description, live_url, tags, featured, sort_order)
        VALUES (?,?,?,?,?,?,?,?)
    ');
    $stmt->execute([
        $d['title']       ?? '',
        $d['category']    ?? 'WordPress',
        $d['image_url']   ?? null,
        $d['description'] ?? null,
        $d['live_url']    ?? null,
        $tags,
        empty($d['featured']) ? 0 : 1,
        $d['sort_order']  ?? 0,
    ]);
    $id   = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM portfolio_items WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    respond(portfolio_decode($stmt->fetch()), 201);
}

// PUT /api/portfolio/:id
if ($method === 'PUT' && preg_match('#^/portfolio/(\d+)$#', $uri, $m)) {
    require_auth();
    $id   = (int)$m[1];
    $d    = body();
    $tags = json_encode(is_array($d['tags'] ?? null) ? $d['tags'] : []);
    $pdo->prepare('
        UPDATE portfolio_items
        SET title=?, category=?, image_url=?, description=?, live_url=?, tags=?, featured=?, sort_order=?
        WHERE id=?
    ')->execute([
        $d['title']       ?? '',
        $d['category']    ?? 'WordPress',
        $d['image_url']   ?? null,
        $d['description'] ?? null,
        $d['live_url']    ?? null,
        $tags,
        empty($d['featured']) ? 0 : 1,
        $d['sort_order']  ?? 0,
        $id,
    ]);
    $stmt = $pdo->prepare('SELECT * FROM portfolio_items WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $item = $stmt->fetch();
    if (!$item) respond(['error' => 'Not found'], 404);
    respond(portfolio_decode($item));
}

// DELETE /api/portfolio/:id
if ($method === 'DELETE' && preg_match('#^/portfolio/(\d+)$#', $uri, $m)) {
    require_auth();
    $pdo->prepare('DELETE FROM portfolio_items WHERE id=?')->execute([(int)$m[1]]);
    respond(['message' => 'Deleted']);
}

respond(['error' => 'Not found'], 404);
