<?php

function service_decode(array $item): array {
    $item['features'] = $item['features'] ? json_decode($item['features'], true) : [];
    $item['active']   = (bool)$item['active'];
    return $item;
}

// GET /api/siteservices
if ($method === 'GET' && $uri === '/siteservices') {
    $stmt  = $pdo->query('SELECT * FROM services_list ORDER BY sort_order ASC, created_at DESC');
    $items = array_map('service_decode', $stmt->fetchAll());
    respond($items);
}

// POST /api/siteservices
if ($method === 'POST' && $uri === '/siteservices') {
    require_auth();
    $d        = body();
    $features = json_encode(is_array($d['features'] ?? null) ? $d['features'] : []);
    $stmt     = $pdo->prepare('
        INSERT INTO services_list (title, tagline, description, features, icon_name, accent_color, badge, sort_order, active)
        VALUES (?,?,?,?,?,?,?,?,?)
    ');
    $stmt->execute([
        $d['title']        ?? '',
        $d['tagline']      ?? null,
        $d['description']  ?? null,
        $features,
        $d['icon_name']    ?? 'FaWordpress',
        $d['accent_color'] ?? '#7cb26e',
        $d['badge']        ?? null,
        $d['sort_order']   ?? 0,
        isset($d['active']) ? ($d['active'] ? 1 : 0) : 1,
    ]);
    $id   = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM services_list WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    respond(service_decode($stmt->fetch()), 201);
}

// PUT /api/siteservices/:id
if ($method === 'PUT' && preg_match('#^/siteservices/(\d+)$#', $uri, $m)) {
    require_auth();
    $id       = (int)$m[1];
    $d        = body();
    $features = json_encode(is_array($d['features'] ?? null) ? $d['features'] : []);
    $pdo->prepare('
        UPDATE services_list
        SET title=?, tagline=?, description=?, features=?, icon_name=?, accent_color=?, badge=?, sort_order=?, active=?
        WHERE id=?
    ')->execute([
        $d['title']        ?? '',
        $d['tagline']      ?? null,
        $d['description']  ?? null,
        $features,
        $d['icon_name']    ?? 'FaWordpress',
        $d['accent_color'] ?? '#7cb26e',
        $d['badge']        ?? null,
        $d['sort_order']   ?? 0,
        isset($d['active']) ? ($d['active'] ? 1 : 0) : 1,
        $id,
    ]);
    $stmt = $pdo->prepare('SELECT * FROM services_list WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $item = $stmt->fetch();
    if (!$item) respond(['error' => 'Not found'], 404);
    respond(service_decode($item));
}

// DELETE /api/siteservices/:id
if ($method === 'DELETE' && preg_match('#^/siteservices/(\d+)$#', $uri, $m)) {
    require_auth();
    $pdo->prepare('DELETE FROM services_list WHERE id=?')->execute([(int)$m[1]]);
    respond(['message' => 'Deleted']);
}

respond(['error' => 'Not found'], 404);
