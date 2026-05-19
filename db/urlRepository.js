const { getDb } = require('./database');

async function findByOriginalUrl(originalUrl) {
  const db = await getDb();
  const result = await db.query('SELECT short_code FROM urls WHERE original_url = $1 LIMIT 1', [originalUrl]);

  if (!result.rows.length) {
    return null;
  }

  return result.rows[0].short_code;
}

async function findByShortCode(shortCode) {
  const db = await getDb();
  const result = await db.query('SELECT original_url FROM urls WHERE short_code = $1 LIMIT 1', [shortCode]);

  if (!result.rows.length) {
    return null;
  }

  return result.rows[0].original_url;
}

async function createUrl(originalUrl, shortCode) {
  const db = await getDb();
  await db.query('INSERT INTO urls (original_url, short_code) VALUES ($1, $2)', [originalUrl, shortCode]);
}

module.exports = {
  findByOriginalUrl,
  findByShortCode,
  createUrl,
};
