<?php

function portfolio_decode(array $item): array {
    $item['tags']     = $item['tags'] ? json_decode($item['tags'], true) : [];
    $item['featured'] = (bool)$item['featured'];
    return $item;
}

function portfolio_slug(string $title): string {
    $slug = strtolower(trim($title));
    $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
    $slug = preg_replace('/[\s-]+/', '-', $slug);
    return trim($slug, '-');
}

// Auto-add new columns if they don't exist yet (safe to run on every request)
try { $pdo->exec("ALTER TABLE portfolio_items ADD COLUMN meta_title VARCHAR(160) NULL"); } catch (PDOException $e) {}
try { $pdo->exec("ALTER TABLE portfolio_items ADD COLUMN seo_description VARCHAR(320) NULL"); } catch (PDOException $e) {}
try { $pdo->exec("ALTER TABLE portfolio_items ADD COLUMN status VARCHAR(32) NOT NULL DEFAULT 'completed'"); } catch (PDOException $e) {}
try { $pdo->exec("ALTER TABLE portfolio_items ADD COLUMN slug VARCHAR(255) NULL"); } catch (PDOException $e) {}
try { $pdo->exec("CREATE UNIQUE INDEX idx_portfolio_slug ON portfolio_items(slug)"); } catch (PDOException $e) {}

// GET /api/portfolio
if ($method === 'GET' && $uri === '/portfolio') {
    $stmt  = $pdo->query('SELECT * FROM portfolio_items ORDER BY featured DESC, sort_order ASC, created_at DESC');
    $items = array_map('portfolio_decode', $stmt->fetchAll());
    respond($items);
}

// GET /api/portfolio/:id  (numeric ID — kept for backward compat)
if ($method === 'GET' && preg_match('#^/portfolio/(\d+)$#', $uri, $m)) {
    $stmt = $pdo->prepare('SELECT * FROM portfolio_items WHERE id = ? LIMIT 1');
    $stmt->execute([(int)$m[1]]);
    $item = $stmt->fetch();
    if (!$item) respond(['error' => 'Not found'], 404);
    respond(portfolio_decode($item));
}

// GET /api/portfolio/slug/:slug
if ($method === 'GET' && preg_match('#^/portfolio/slug/([a-z0-9-]+)$#', $uri, $m)) {
    $stmt = $pdo->prepare('SELECT * FROM portfolio_items WHERE slug = ? LIMIT 1');
    $stmt->execute([$m[1]]);
    $item = $stmt->fetch();
    if (!$item) respond(['error' => 'Not found'], 404);
    respond(portfolio_decode($item));
}

// POST /api/portfolio
if ($method === 'POST' && $uri === '/portfolio') {
    require_auth();
    $d    = body();
    $tags = json_encode(is_array($d['tags'] ?? null) ? $d['tags'] : []);
    $base_slug = $d['slug'] ?? portfolio_slug($d['title'] ?? 'project');
    // Ensure slug uniqueness
    $slug = $base_slug; $i = 1;
    while (true) {
        $ck = $pdo->prepare('SELECT id FROM portfolio_items WHERE slug = ? LIMIT 1');
        $ck->execute([$slug]);
        if (!$ck->fetch()) break;
        $slug = $base_slug . '-' . $i++;
    }
    $stmt = $pdo->prepare('
        INSERT INTO portfolio_items
            (title, category, image_url, description, live_url, tags, featured, sort_order, meta_title, seo_description, status, slug)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    ');
    $stmt->execute([
        $d['title']           ?? '',
        $d['category']        ?? 'WordPress',
        $d['image_url']       ?? null,
        $d['description']     ?? null,
        $d['live_url']        ?? null,
        $tags,
        empty($d['featured']) ? 0 : 1,
        $d['sort_order']      ?? 0,
        $d['meta_title']      ?? null,
        $d['seo_description'] ?? null,
        $d['status']          ?? 'completed',
        $slug,
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
    // Re-generate slug if title changed, or use existing
    $base_slug = $d['slug'] ?? portfolio_slug($d['title'] ?? 'project');
    $slug = $base_slug; $i = 1;
    while (true) {
        $ck = $pdo->prepare('SELECT id FROM portfolio_items WHERE slug = ? AND id != ? LIMIT 1');
        $ck->execute([$slug, $id]);
        if (!$ck->fetch()) break;
        $slug = $base_slug . '-' . $i++;
    }
    $pdo->prepare('
        UPDATE portfolio_items
        SET title=?, category=?, image_url=?, description=?, live_url=?, tags=?, featured=?, sort_order=?,
            meta_title=?, seo_description=?, status=?, slug=?
        WHERE id=?
    ')->execute([
        $d['title']           ?? '',
        $d['category']        ?? 'WordPress',
        $d['image_url']       ?? null,
        $d['description']     ?? null,
        $d['live_url']        ?? null,
        $tags,
        empty($d['featured']) ? 0 : 1,
        $d['sort_order']      ?? 0,
        $d['meta_title']      ?? null,
        $d['seo_description'] ?? null,
        $d['status']          ?? 'completed',
        $slug,
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
