/**
 * First-time database setup:
 *   1. Runs schema.sql
 *   2. Creates the admin user from .env credentials
 *
 * Usage:  node scripts/setup-db.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs     = require('fs');
const path   = require('path');
const bcrypt = require('bcryptjs');
const db     = require('../db');

async function setup() {
  console.log('🗄  Running schema...');
  const sql = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
  await db.query(sql);
  console.log('✓  Schema applied');

  const email    = process.env.ADMIN_EMAIL    || 'admin@aizazaliafridi.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';
  const name     = 'Aizaz Ali Afridi';

  const hash = await bcrypt.hash(password, 12);

  await db.query(`
    INSERT INTO admin_users (email, password, name)
    VALUES ($1, $2, $3)
    ON CONFLICT (email) DO UPDATE SET password = $2
  `, [email, hash, name]);

  console.log(`✓  Admin user created: ${email}`);
  console.log('');
  console.log('Setup complete! Start server with: npm run dev');
  process.exit(0);
}

setup().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
