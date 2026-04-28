-- ═══════════════════════════════════════════════════
--  aizazaliafridi.com — Database Schema
--  Run: psql -U postgres -d aizaz_portfolio -f schema.sql
-- ═══════════════════════════════════════════════════

-- Admin users
CREATE TABLE IF NOT EXISTS admin_users (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,            -- bcrypt hash
  name       VARCHAR(100) NOT NULL DEFAULT 'Aizaz Ali Afridi',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog categories
CREATE TABLE IF NOT EXISTS categories (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) UNIQUE NOT NULL,
  slug       VARCHAR(100) UNIQUE NOT NULL,
  color      VARCHAR(7) DEFAULT '#7cb26e',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS posts (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(500) NOT NULL,
  slug          VARCHAR(500) UNIQUE NOT NULL,
  excerpt       TEXT,
  content       TEXT NOT NULL,                 -- HTML / Markdown
  cover_image   VARCHAR(500),                  -- path to uploaded image
  cover_alt     VARCHAR(300),                  -- alt text for SEO
  category_id   INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  status        VARCHAR(20) DEFAULT 'draft'    -- 'draft' | 'published'
                  CHECK (status IN ('draft','published')),
  read_time     VARCHAR(20),                   -- e.g. '5 min read'
  meta_title    VARCHAR(500),
  meta_desc     VARCHAR(300),
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Downloadable files attached to posts
CREATE TABLE IF NOT EXISTS post_downloads (
  id           SERIAL PRIMARY KEY,
  post_id      INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  label        VARCHAR(300) NOT NULL,          -- e.g. "Download Speed Checklist (PDF)"
  file_path    VARCHAR(500) NOT NULL,          -- stored file path
  file_name    VARCHAR(255) NOT NULL,          -- original filename
  file_size    BIGINT,                         -- bytes
  mime_type    VARCHAR(100),
  download_count INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Post images (inline images within blog content)
CREATE TABLE IF NOT EXISTS post_images (
  id         SERIAL PRIMARY KEY,
  post_id    INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  file_path  VARCHAR(500) NOT NULL,
  alt_text   VARCHAR(300),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on posts
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS posts_updated_at ON posts;
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed default categories
INSERT INTO categories (name, slug, color) VALUES
  ('WordPress',   'wordpress',   '#21759b'),
  ('Shopify',     'shopify',     '#96bf48'),
  ('React',       'react',       '#7cb26e'),
  ('Freelancing', 'freelancing', '#f97316')
ON CONFLICT (slug) DO NOTHING;
