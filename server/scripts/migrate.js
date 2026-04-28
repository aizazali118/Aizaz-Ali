require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../db');

async function migrate() {
  console.log('Running migration...');
  await db.query(`
    CREATE TABLE IF NOT EXISTS portfolio_items (
      id          SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      category    TEXT NOT NULL DEFAULT 'WordPress',
      image_url   TEXT,
      description TEXT,
      live_url    TEXT,
      tags        TEXT[] DEFAULT '{}',
      featured    BOOLEAN DEFAULT false,
      sort_order  INT DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS services_list (
      id           SERIAL PRIMARY KEY,
      title        TEXT NOT NULL,
      tagline      TEXT,
      description  TEXT,
      features     TEXT[] DEFAULT '{}',
      icon_name    TEXT DEFAULT 'FaWordpress',
      accent_color TEXT DEFAULT '#7cb26e',
      badge        TEXT,
      sort_order   INT DEFAULT 0,
      active       BOOLEAN DEFAULT true,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id           SERIAL PRIMARY KEY,
      client_name  TEXT NOT NULL,
      client_title TEXT,
      company      TEXT,
      avatar_url   TEXT,
      content      TEXT NOT NULL,
      rating       INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
      featured     BOOLEAN DEFAULT false,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('✓ Migration complete');
  process.exit(0);
}

migrate().catch(err => { console.error('Migration failed:', err.message); process.exit(1); });
