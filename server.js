const express = require('express');
const path = require('path');
const shortenRouter = require('./routes/shorten');
const redirectRouter = require('./routes/redirect');
const { initDatabase } = require('./db/database');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const allowedOrigins = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set('trust proxy', true);

app.use(express.json());
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin) {
    return next();
  }

  if (!allowedOrigins.length) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else {
    return res.status(403).json({ error: 'Origin nicht erlaubt.' });
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/shorten', shortenRouter);
app.use('/', redirectRouter);

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server läuft auf http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Datenbank konnte nicht initialisiert werden:', error);
    process.exit(1);
  });
