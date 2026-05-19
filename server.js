const { createApp } = require('./app');
const { initDatabase } = require('./db/database');

const app = createApp();
const PORT = Number(process.env.PORT) || 5000;

async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server läuft auf http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Datenbank konnte nicht initialisiert werden:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = { app, start };
