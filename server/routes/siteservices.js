const express     = require('express');
const db          = require('../db');
const requireAuth = require('../middleware/auth');
const router      = express.Router();

router.get('/', async (_req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM services_list ORDER BY sort_order, created_at');
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.post('/', requireAuth, async (req, res) => {
  const { title, tagline, description, features, icon_name, accent_color, badge, sort_order, active } = req.body;
  try {
    const { rows } = await db.query(`
      INSERT INTO services_list (title, tagline, description, features, icon_name, accent_color, badge, sort_order, active)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *
    `, [title, tagline || null, description || null, features || [],
        icon_name || 'FaWordpress', accent_color || '#7cb26e', badge || null,
        sort_order || 0, active !== false]);
    res.status(201).json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id', requireAuth, async (req, res) => {
  const { title, tagline, description, features, icon_name, accent_color, badge, sort_order, active } = req.body;
  try {
    const { rows } = await db.query(`
      UPDATE services_list SET title=$1, tagline=$2, description=$3, features=$4, icon_name=$5,
        accent_color=$6, badge=$7, sort_order=$8, active=$9 WHERE id=$10 RETURNING *
    `, [title, tagline || null, description || null, features || [],
        icon_name || 'FaWordpress', accent_color || '#7cb26e', badge || null,
        sort_order || 0, active !== false, req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM services_list WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
