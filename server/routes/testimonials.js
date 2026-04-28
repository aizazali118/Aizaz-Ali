const express     = require('express');
const db          = require('../db');
const requireAuth = require('../middleware/auth');
const router      = express.Router();

router.get('/', async (_req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM testimonials ORDER BY featured DESC, created_at DESC');
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.post('/', requireAuth, async (req, res) => {
  const { client_name, client_title, company, avatar_url, content, rating, featured } = req.body;
  try {
    const { rows } = await db.query(`
      INSERT INTO testimonials (client_name, client_title, company, avatar_url, content, rating, featured)
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
    `, [client_name, client_title || null, company || null, avatar_url || null,
        content, rating || 5, featured || false]);
    res.status(201).json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id', requireAuth, async (req, res) => {
  const { client_name, client_title, company, avatar_url, content, rating, featured } = req.body;
  try {
    const { rows } = await db.query(`
      UPDATE testimonials SET client_name=$1, client_title=$2, company=$3, avatar_url=$4,
        content=$5, rating=$6, featured=$7 WHERE id=$8 RETURNING *
    `, [client_name, client_title || null, company || null, avatar_url || null,
        content, rating || 5, featured || false, req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM testimonials WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
