const express     = require('express');
const db          = require('../db');
const requireAuth = require('../middleware/auth');
const router      = express.Router();

router.get('/', async (_req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM portfolio_items ORDER BY sort_order, created_at DESC');
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.post('/', requireAuth, async (req, res) => {
  const { title, category, image_url, description, live_url, tags, featured, sort_order } = req.body;
  try {
    const { rows } = await db.query(`
      INSERT INTO portfolio_items (title, category, image_url, description, live_url, tags, featured, sort_order)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `, [title, category || 'WordPress', image_url || null, description || null,
        live_url || null, tags || [], featured || false, sort_order || 0]);
    res.status(201).json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id', requireAuth, async (req, res) => {
  const { title, category, image_url, description, live_url, tags, featured, sort_order } = req.body;
  try {
    const { rows } = await db.query(`
      UPDATE portfolio_items SET title=$1, category=$2, image_url=$3, description=$4, live_url=$5,
        tags=$6, featured=$7, sort_order=$8 WHERE id=$9 RETURNING *
    `, [title, category, image_url || null, description || null, live_url || null,
        tags || [], featured || false, sort_order || 0, req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM portfolio_items WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
