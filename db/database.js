const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'urls.db');

let db;
let isInitialized = false;

function ensureSchema(database) {
  database.run(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_url TEXT NOT NULL,
      short_code TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  database.run('CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code)');
  database.run('CREATE INDEX IF NOT EXISTS idx_urls_original_url ON urls(original_url)');
}

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  if (!isInitialized) {
    ensureSchema(db);
    isInitialized = true;
    saveDb();
  }

  return db;
}

async function initDatabase() {
  await getDb();
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

module.exports = { getDb, saveDb, initDatabase };
