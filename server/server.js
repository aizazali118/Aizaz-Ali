require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const path       = require('path');

const authRoutes    = require('./routes/auth');
const postsRoutes   = require('./routes/posts');
const uploadsRoutes = require('./routes/uploads');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── Security & CORS ── */
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
}));

/* ── Body parser ── */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ── Serve uploaded files ── */
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || './uploads');
app.use('/uploads', express.static(UPLOAD_DIR));

/* ── API Routes ── */
app.use('/api/auth',    authRoutes);
app.use('/api/posts',   postsRoutes);
app.use('/api/uploads', uploadsRoutes);

/* ── Health check ── */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ── 404 handler ── */
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ── Error handler ── */
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 API server running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Env:    ${process.env.NODE_ENV || 'development'}\n`);
});
