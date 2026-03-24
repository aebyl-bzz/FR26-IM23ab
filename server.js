const express = require('express');
const path = require('path');
const shortenRouter = require('./routes/shorten');
const redirectRouter = require('./routes/redirect');
const { initDatabase } = require('./db/database');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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
