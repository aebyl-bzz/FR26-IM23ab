const express = require('express');
const path = require('path');
const shortenRouter = require('./routes/shorten');
const redirectRouter = require('./routes/redirect');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/shorten', shortenRouter);
app.use('/', redirectRouter);

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
