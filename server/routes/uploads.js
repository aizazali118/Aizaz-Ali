const express  = require('express');
const multer   = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { Readable } = require('stream');
const db         = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only images (jpg, png, webp, gif, avif) are allowed'));
};

const maxMB = Number(process.env.MAX_FILE_SIZE_MB || 20) * 1024 * 1024;
const uploadImage    = multer({ storage: multer.memoryStorage(), fileFilter: imageFilter, limits: { fileSize: maxMB } });
const uploadDownload = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxMB } });

function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err); else resolve(result);
    });
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
}

/* POST /api/uploads/image */
router.post('/image', requireAuth, uploadImage.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'aizaz-blog/images',
      resource_type: 'image',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });
    res.json({
      url:          result.secure_url,
      publicId:     result.public_id,
      originalName: req.file.originalname,
      size:         req.file.size,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

/* POST /api/uploads/download/:postId */
router.post('/download/:postId', requireAuth, uploadDownload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const { postId } = req.params;
  const { label }  = req.body;
  try {
    const result = await uploadToCloudinary(req.file.buffer, {
      folder:        'aizaz-blog/downloads',
      resource_type: 'raw',
      use_filename:  true,
      unique_filename: true,
    });
    const { rows } = await db.query(`
      INSERT INTO post_downloads (post_id, label, file_path, file_name, file_size, mime_type)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [postId, label || req.file.originalname, result.secure_url,
        req.file.originalname, req.file.size, req.file.mimetype]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* DELETE /api/uploads/download/:id */
router.delete('/download/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT file_path FROM post_downloads WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });

    // Try to delete from Cloudinary (best-effort)
    try {
      const url = rows[0].file_path;
      const afterUpload = url.split('/upload/')[1];
      if (afterUpload) {
        const publicId = afterUpload.replace(/^v\d+\//, '').replace(/\.[^.]+$/, '');
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      }
    } catch (e) {
      console.warn('Cloudinary delete warning:', e.message);
    }

    await db.query('DELETE FROM post_downloads WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
