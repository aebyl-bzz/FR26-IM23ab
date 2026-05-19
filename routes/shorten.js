const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const { findByOriginalUrl, findByShortCode, createUrl } = require('../db/urlRepository');

function getPublicBaseUrl(req) {
  return (process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
}

async function generateUniqueCode() {
  const maxAttempts = 10;

  for (let i = 0; i < maxAttempts; i += 1) {
    const code = nanoid(6);
    const existingUrl = await findByShortCode(code);

    if (!existingUrl) {
      return code;
    }
  }

  throw new Error('Konnte keinen eindeutigen Kurzcode erzeugen.');
}

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

  try {
    const existingCode = await findByOriginalUrl(url);
    const publicBaseUrl = getPublicBaseUrl(req);

    if (existingCode) {
      return res.json({ shortUrl: `${publicBaseUrl}/${existingCode}`, code: existingCode });
    }

    const shortCode = await generateUniqueCode();
    await createUrl(url, shortCode);

    return res.status(201).json({ shortUrl: `${publicBaseUrl}/${shortCode}`, code: shortCode });
  } catch (error) {
    return res.status(500).json({ error: 'Interner Fehler beim Erzeugen des Kurzlinks.' });
  }
});

module.exports = router;
