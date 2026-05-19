const express = require('express');
const router = express.Router();
const { findByShortCode } = require('../db/urlRepository');

router.get('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const originalUrl = await findByShortCode(code);

    if (!originalUrl) {
      return res.status(404).send('Kurzlink nicht gefunden.');
    }

    return res.redirect(originalUrl);
  } catch {
    return res.status(500).send('Interner Fehler.');
  }
});

module.exports = router;
