const { getDb, saveDb } = require('./database');

async function findByOriginalUrl(originalUrl) {
  const db = await getDb();
  const result = db.exec('SELECT short_code FROM urls WHERE original_url = ?', [originalUrl]);

  if (!result.length || !result[0].values.length) {
    return null;
  }

  return result[0].values[0][0];
}

async function findByShortCode(shortCode) {
  const db = await getDb();
  const result = db.exec('SELECT original_url FROM urls WHERE short_code = ?', [shortCode]);

  if (!result.length || !result[0].values.length) {
    return null;
  }

  return result[0].values[0][0];
}

async function createUrl(originalUrl, shortCode) {
  const db = await getDb();
  db.run('INSERT INTO urls (original_url, short_code) VALUES (?, ?)', [originalUrl, shortCode]);
  saveDb();
}

module.exports = {
  findByOriginalUrl,
  findByShortCode,
  createUrl,
};
