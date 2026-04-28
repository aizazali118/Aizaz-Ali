const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { v4: uuid } = require('uuid');
const db      = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || './uploads');
fs.mkdirSync(path.join(UPLOAD_DIR, 'images'),    { recursive: true });
fs.mkdirSync(path.join(UPLOAD_DIR, 'downloads'), { recursive: true });

/* ── Multer config ── */
function makeStorage(subfolder) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(UPLOAD_DIR, subfolder)),
    filename: (_req, file, cb) => {
      const ext  = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuid()}${ext}`);
    },
  });
}

const imageFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg','image/png','image/webp','image/gif','image/avif'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only images (jpg, png, webp, gif, avif) are allowed'));
};

const fileFilter = (_req, _file, cb) => cb(null, true); // allow any file for downloads

const maxMB = Number(process.env.MAX_FILE_SIZE_MB || 20) * 1024 * 1024;

const uploadImage    = multer({ storage: makeStorage('images'),    fileFilter: imageFilter,    limits: { fileSize: maxMB } });
const uploadDownload = multer({ storage: makeStorage('downloads'), fileFilter: fileFilter,     limits: { fileSize: maxMB } });

/* ── POST /api/uploads/image — single blog/cover image ── */
router.post('/image', requireAuth, uploadImage.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const url = `/uploads/images/${req.file.filename}`;
  res.json({
    url,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
  });
});

/* ── POST /api/uploads/download/:postId — attach downloadable file to a post ── */
router.post('/download/:postId', requireAuth, uploadDownload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const { postId } = req.params;
  const { label }  = req.body;
  const filePath   = `/uploads/downloads/${req.file.filename}`;

  try {
    const { rows } = await db.query(`
      INSERT INTO post_downloads (post_id, label, file_path, file_name, file_size, mime_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [postId, label || req.file.originalname, filePath,
        req.file.originalname, req.file.size, req.file.mimetype]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* ── DELETE /api/uploads/download/:id — remove a download attachment ── */
router.delete('/download/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT file_path FROM post_downloads WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });

    const absPath = path.join(UPLOAD_DIR, rows[0].file_path.replace('/uploads/', ''));
    if (fs.existsSync(absPath)) fs.unlinkSync(absPath);

    await db.query('DELETE FROM post_downloads WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* ── GET /uploads/* — serve uploaded files ── */
router.use('/', express.static(UPLOAD_DIR));

module.exports = router;
