const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://appuser:apppassword@localhost:5432/appdb';

let pool;

function getDb() {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    connectionString: DATABASE_URL,
  });

  return pool;
}

async function initDatabase() {
  const db = getDb();

  await db.query(`
    CREATE TABLE IF NOT EXISTS urls (
      id SERIAL PRIMARY KEY,
      original_url TEXT NOT NULL,
      short_code TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query('CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_urls_original_url ON urls(original_url)');
}

module.exports = { getDb, initDatabase };
