const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

router.get('/:code', async (req, res) => {
  const { code } = req.params;
  const db = await getDb();

  const result = db.exec('SELECT original_url FROM urls WHERE short_code = ?', [code]);

  if (!result.length || !result[0].values.length) {
    return res.status(404).send('Kurzlink nicht gefunden.');
  }

  res.redirect(result[0].values[0][0]);
});

module.exports = router;
