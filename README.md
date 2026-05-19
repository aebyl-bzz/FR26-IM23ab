# URL-Shortener

Eine Web-Applikation, die lange URLs zu kurzen Links verkürzt.

Das Projekt ist jetzt wieder als echtes Backend-Frontend-Setup aufgebaut und für Deployment des Backends auf AWS vorbereitet.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Datenbank:** SQLite (sql.js)

## Installation

```bash
npm install
npm start
```

Der Server läuft dann auf [http://localhost:3000](http://localhost:3000).

## Konfiguration

Für Backend-Deployment (z.B. AWS) stehen folgende Umgebungsvariablen zur Verfügung:

- `PORT` (Default: `3000`)
- `PUBLIC_BASE_URL` (z.B. `https://short.example.com`)
- `FRONTEND_ORIGIN` (kommasepariert, z.B. `https://deinname.github.io,http://localhost:3000`)
- `DB_PATH` (Default: `db/urls.db`)

Für getrenntes Frontend/Backend kannst du in [public/config.js](public/config.js) setzen:

```js
window.URL_SHORTENER_API_BASE = 'https://dein-backend.example.com';
```

Wenn leer (`''`), verwendet das Frontend denselben Origin wie die Seite.

## AWS Deployment (Backend)

Das Projekt enthält ein [Dockerfile](Dockerfile) und ist damit direkt für AWS App Runner, ECS/Fargate oder Elastic Beanstalk (Docker Plattform) geeignet.

Beispiel lokal:

```bash
docker build -t url-shortener .
docker run -p 8080:8080 -e PORT=8080 -e PUBLIC_BASE_URL=http://localhost:8080 url-shortener
```

Healthcheck Endpoint:

```text
GET /health
```

Hinweis: SQLite-Dateien sind bei manchen AWS Deployments (z.B. Container-Restarts) nicht dauerhaft persistent. Für Produktion empfiehlt sich eine verwaltete Datenbank (z.B. RDS).

## GitHub Pages (optional Frontend)

Das Frontend kann weiterhin statisch über GitHub Pages ausgeliefert werden. Dafür bleibt [index.html](index.html) im Repository-Root und ruft das Backend über `URL_SHORTENER_API_BASE` auf.

## Features

- URL kürzen
- Automatische Weiterleitung beim Aufrufen des Kurzlinks über das Backend (`/:code`)
- URL-Validierung mit Fehlermeldungen
- Kopier-Button für den Kurzlink
