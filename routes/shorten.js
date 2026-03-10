const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const { getDb, saveDb } = require('../db/database');

router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL fehlt.' });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Ungültige URL. Bitte eine vollständige URL eingeben (z.B. https://example.com).' });
  }

  const db = await getDb();

  const existing = db.exec('SELECT short_code FROM urls WHERE original_url = ?', [url]);
  if (existing.length > 0 && existing[0].values.length > 0) {
    const code = existing[0].values[0][0];
    return res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${code}` });
  }

  const shortCode = nanoid(6);
  db.run('INSERT INTO urls (original_url, short_code) VALUES (?, ?)', [url, shortCode]);
  saveDb();

  res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}` });
});

module.exports = router;
