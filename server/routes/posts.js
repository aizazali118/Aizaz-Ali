const express    = require('express');
const { body, validationResult } = require('express-validator');
const slugify    = require('slugify');
const db         = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

/* ── helpers ── */
function makeSlug(title) {
  return slugify(title, { lower: true, strict: true, trim: true });
}

function estimateReadTime(content) {
  const words = (content || '').replace(/<[^>]+>/g, '').split(/\s+/).length;
  const mins  = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

/* ══════════ PUBLIC ROUTES ══════════ */

/* GET /api/posts — published posts (public blog listing) */
router.get('/', async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let where = `p.status = 'published'`;
  const params = [];
  if (category) {
    params.push(category);
    where += ` AND c.slug = $${params.length}`;
  }

  try {
    const { rows: posts } = await db.query(`
      SELECT
        p.id, p.title, p.slug, p.excerpt, p.cover_image, p.cover_alt,
        p.read_time, p.published_at, p.meta_title, p.meta_desc,
        c.name AS category, c.slug AS category_slug, c.color AS category_color,
        (SELECT json_agg(json_build_object(
          'id', d.id, 'label', d.label, 'file_name', d.file_name
        )) FROM post_downloads d WHERE d.post_id = p.id) AS downloads
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE ${where}
      ORDER BY p.published_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `, [...params, limit, offset]);

    const { rows: [{ count }] } = await db.query(
      `SELECT COUNT(*) FROM posts p LEFT JOIN categories c ON c.id = p.category_id WHERE ${where}`,
      params
    );

    res.json({ posts, total: Number(count), page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* GET /api/posts/:slug — single published post */
router.get('/:slug', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        p.*,
        c.name AS category, c.slug AS category_slug, c.color AS category_color,
        (SELECT json_agg(json_build_object(
          'id', d.id, 'label', d.label, 'file_name', d.file_name,
          'file_path', d.file_path, 'file_size', d.file_size
        )) FROM post_downloads d WHERE d.post_id = p.id) AS downloads
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.slug = $1 AND p.status = 'published'
    `, [req.params.slug]);

    if (!rows[0]) return res.status(404).json({ error: 'Post not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* ══════════ ADMIN ROUTES (require JWT) ══════════ */

/* GET /api/posts/admin/all — all posts including drafts */
router.get('/admin/all', requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT p.id, p.title, p.slug, p.status, p.read_time,
             p.published_at, p.created_at, p.updated_at,
             c.name AS category, c.color AS category_color
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* GET /api/posts/admin/:id — single post for editing */
router.get('/admin/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT p.*,
             c.name AS category, c.slug AS category_slug,
             (SELECT json_agg(json_build_object(
               'id', d.id, 'label', d.label, 'file_name', d.file_name,
               'file_path', d.file_path, 'file_size', d.file_size
             )) FROM post_downloads d WHERE d.post_id = p.id) AS downloads
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1
    `, [req.params.id]);

    if (!rows[0]) return res.status(404).json({ error: 'Post not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* POST /api/posts — create post */
router.post('/', requireAuth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    title, content, excerpt, category_id, status = 'draft',
    cover_image, cover_alt, meta_title, meta_desc,
  } = req.body;

  // Ensure unique slug
  let slug = makeSlug(title);
  const { rows: existing } = await db.query('SELECT id FROM posts WHERE slug = $1', [slug]);
  if (existing.length) slug = `${slug}-${Date.now()}`;

  const published_at = status === 'published' ? new Date() : null;
  const read_time    = estimateReadTime(content);

  try {
    const { rows } = await db.query(`
      INSERT INTO posts (title, slug, content, excerpt, category_id, status,
                         cover_image, cover_alt, read_time, meta_title, meta_desc, published_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `, [title, slug, content, excerpt, category_id || null, status,
        cover_image || null, cover_alt || null, read_time,
        meta_title || title, meta_desc || excerpt || null, published_at]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* PUT /api/posts/:id — update post */
router.put('/:id', requireAuth, async (req, res) => {
  const {
    title, content, excerpt, category_id, status,
    cover_image, cover_alt, meta_title, meta_desc,
  } = req.body;

  const read_time = estimateReadTime(content);
  let published_at_clause = '';

  try {
    const { rows: [existing] } = await db.query('SELECT status, published_at FROM posts WHERE id = $1', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Post not found' });

    const published_at = (status === 'published' && existing.status !== 'published')
      ? new Date()
      : existing.published_at;

    const { rows } = await db.query(`
      UPDATE posts SET
        title=$1, content=$2, excerpt=$3, category_id=$4, status=$5,
        cover_image=$6, cover_alt=$7, read_time=$8,
        meta_title=$9, meta_desc=$10, published_at=$11
      WHERE id = $12
      RETURNING *
    `, [title, content, excerpt, category_id || null, status,
        cover_image || null, cover_alt || null, read_time,
        meta_title || title, meta_desc || excerpt || null,
        published_at, req.params.id]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* DELETE /api/posts/:id */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* GET /api/posts/categories/all */
router.get('/categories/all', async (_req, res) => {
  const { rows } = await db.query('SELECT * FROM categories ORDER BY name');
  res.json(rows);
});

module.exports = router;
