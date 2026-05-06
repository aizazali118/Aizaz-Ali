<?php

// ── GET /api/posts/categories/all ────────────────────────────
if ($method === 'GET' && $uri === '/posts/categories/all') {
    $stmt = $pdo->query('SELECT * FROM categories ORDER BY name ASC');
    respond($stmt->fetchAll());
}

// ── GET /api/posts/admin/all ─────────────────────────────────
if ($method === 'GET' && $uri === '/posts/admin/all') {
    require_auth();
    $stmt = $pdo->query('
        SELECT p.*, c.name AS category, c.color AS category_color, c.slug AS category_slug
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
    ');
    respond($stmt->fetchAll());
}

// ── GET /api/posts/admin/:id ──────────────────────────────────
if ($method === 'GET' && preg_match('#^/posts/admin/(\d+)$#', $uri, $m)) {
    require_auth();
    $id   = (int)$m[1];
    $stmt = $pdo->prepare('
        SELECT p.*, c.name AS category, c.color AS category_color, c.slug AS category_slug
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ? LIMIT 1
    ');
    $stmt->execute([$id]);
    $post = $stmt->fetch();
    if (!$post) respond(['error' => 'Not found'], 404);

    $dl = $pdo->prepare('SELECT * FROM downloads WHERE post_id = ? ORDER BY created_at ASC');
    $dl->execute([$id]);
    $post['downloads'] = $dl->fetchAll();

    respond($post);
}

// ── GET /api/posts (public list) ──────────────────────────────
if ($method === 'GET' && $uri === '/posts') {
    $page   = max(1, (int)($_GET['page']  ?? 1));
    $limit  = min(50, max(1, (int)($_GET['limit'] ?? 10)));
    $cat    = $_GET['category'] ?? '';
    $offset = ($page - 1) * $limit;

    $where  = "WHERE p.status = 'published'";
    $params = [];
    if ($cat) {
        $where   .= ' AND c.slug = ?';
        $params[] = $cat;
    }

    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM posts p LEFT JOIN categories c ON p.category_id = c.id $where");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    $stmt = $pdo->prepare("
        SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image, p.cover_alt,
               p.read_time, p.published_at, p.created_at,
               c.name AS category, c.color AS category_color, c.slug AS category_slug
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        $where
        ORDER BY p.published_at DESC, p.created_at DESC
        LIMIT ? OFFSET ?
    ");
    $stmt->execute([...$params, $limit, $offset]);
    $posts = $stmt->fetchAll();

    foreach ($posts as &$post) {
        $dl = $pdo->prepare('SELECT * FROM downloads WHERE post_id = ?');
        $dl->execute([$post['id']]);
        $post['downloads'] = $dl->fetchAll();
    }

    respond(['posts' => $posts, 'total' => $total, 'page' => $page, 'limit' => $limit]);
}

// ── GET /api/posts/:slug (public single) ──────────────────────
if ($method === 'GET' && preg_match('#^/posts/([^/]+)$#', $uri, $m)) {
    $slug = $m[1];
    $stmt = $pdo->prepare("
        SELECT p.*, c.name AS category, c.color AS category_color, c.slug AS category_slug
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.slug = ? AND p.status = 'published' LIMIT 1
    ");
    $stmt->execute([$slug]);
    $post = $stmt->fetch();
    if (!$post) respond(['error' => 'Not found'], 404);

    $dl = $pdo->prepare('SELECT * FROM downloads WHERE post_id = ? ORDER BY created_at ASC');
    $dl->execute([$post['id']]);
    $post['downloads'] = $dl->fetchAll();

    respond($post);
}

// ── POST /api/posts (admin create) ───────────────────────────
if ($method === 'POST' && $uri === '/posts') {
    require_auth();
    $d = body();

    if (empty($d['title'])) respond(['error' => 'Title is required'], 400);

    // Generate unique slug
    $base = slug($d['title']);
    $s    = $base;
    $n    = 1;
    while (true) {
        $check = $pdo->prepare('SELECT id FROM posts WHERE slug = ? LIMIT 1');
        $check->execute([$s]);
        if (!$check->fetch()) break;
        $s = $base . '-' . $n++;
    }

    $published_at = ($d['status'] ?? 'draft') === 'published' ? date('Y-m-d H:i:s') : null;

    $stmt = $pdo->prepare('
        INSERT INTO posts
          (title, slug, excerpt, content, cover_image, cover_alt, category_id, status, read_time, meta_title, meta_desc, published_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    ');
    $stmt->execute([
        $d['title'],
        $s,
        $d['excerpt']     ?? null,
        $d['content']     ?? '',
        $d['cover_image'] ?? null,
        $d['cover_alt']   ?? null,
        ($d['category_id'] ?? '') ?: null,
        $d['status']      ?? 'draft',
        $d['read_time']   ?? null,
        $d['meta_title']  ?? null,
        $d['meta_desc']   ?? null,
        $published_at,
    ]);

    $id   = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM posts WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    respond($stmt->fetch(), 201);
}

// ── PUT /api/posts/:id (admin update) ────────────────────────
if ($method === 'PUT' && preg_match('#^/posts/(\d+)$#', $uri, $m)) {
    require_auth();
    $id = (int)$m[1];
    $d  = body();

    $cur = $pdo->prepare('SELECT status, published_at FROM posts WHERE id = ? LIMIT 1');
    $cur->execute([$id]);
    $current = $cur->fetch();
    if (!$current) respond(['error' => 'Not found'], 404);

    $published_at = $current['published_at'];
    if (($d['status'] ?? '') === 'published' && $current['status'] !== 'published') {
        $published_at = date('Y-m-d H:i:s');
    }

    $fields = [
        'title=?', 'excerpt=?', 'content=?', 'cover_alt=?',
        'category_id=?', 'status=?', 'read_time=?',
        'meta_title=?', 'meta_desc=?', 'published_at=?',
    ];
    $params = [
        $d['title']       ?? '',
        $d['excerpt']     ?? null,
        $d['content']     ?? '',
        $d['cover_alt']   ?? null,
        ($d['category_id'] ?? '') ?: null,
        $d['status']      ?? 'draft',
        $d['read_time']   ?? null,
        $d['meta_title']  ?? null,
        $d['meta_desc']   ?? null,
        $published_at,
    ];

    if (isset($d['cover_image'])) {
        $fields[] = 'cover_image=?';
        $params[] = $d['cover_image'];
    }

    $params[] = $id;
    $pdo->prepare('UPDATE posts SET ' . implode(',', $fields) . ' WHERE id=?')->execute($params);

    $stmt = $pdo->prepare('SELECT * FROM posts WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    respond($stmt->fetch());
}

// ── DELETE /api/posts/:id (admin) ─────────────────────────────
if ($method === 'DELETE' && preg_match('#^/posts/(\d+)$#', $uri, $m)) {
    require_auth();
    $id = (int)$m[1];
    $pdo->prepare('DELETE FROM posts WHERE id=?')->execute([$id]);
    respond(['message' => 'Deleted']);
}

respond(['error' => 'Not found'], 404);
