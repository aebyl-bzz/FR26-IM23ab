# URL-Shortener

Eine Web-Applikation, die lange URLs zu kurzen Links verkürzt.

Das Projekt ist als echtes Backend-Frontend-Setup aufgebaut und für DB- plus Backend-Deployment in der BZZ AWS Jenkins-Umgebung vorbereitet.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Datenbank:** PostgreSQL

## Installation

```bash
npm install
npm start
```

Der Server läuft dann auf [http://localhost:5000](http://localhost:5000).

## Konfiguration

Für Backend-Deployment (z.B. AWS) stehen folgende Umgebungsvariablen zur Verfügung:

- `PORT` (Default: `5000`)
- `PUBLIC_BASE_URL` (z.B. `https://short.example.com`)
- `FRONTEND_ORIGIN` (kommasepariert, z.B. `https://deinname.github.io,http://localhost:5000`)
- `DATABASE_URL` (z.B. `postgresql://appuser:apppassword@localhost:5432/appdb`)

Für getrenntes Frontend/Backend kannst du in [public/config.js](public/config.js) setzen:

```js
window.URL_SHORTENER_API_BASE = 'https://dein-backend.example.com';
```

Wenn leer (`''`), verwendet das Frontend denselben Origin wie die Seite.

## AWS Deployment (Backend + DB via Jenkins)

Das Projekt enthält eine [Jenkinsfile](Jenkinsfile), die in der BZZ AWS Build-Umgebung folgende Stages ausführt:

- PostgreSQL-Container starten (`${PROJECT_NAME}_${BRANCH_NAME}_db`)
- Backend-Image bauen
- Backend-Container deployen (`${PROJECT_NAME}_${BRANCH_NAME}_backend`) auf Port `5000`
- Healthcheck über das BZZ-Forwarding

Beispiel lokal:

```bash
docker build -t url-shortener .
docker run -p 5000:5000 -e PORT=5000 -e DATABASE_URL=postgresql://appuser:apppassword@localhost:5432/appdb url-shortener
```

Backend-URL in AWS (Pattern):

```text
http://54.80.83.95/api/${PROJECT_NAME}/${BRANCH_NAME}/api/shorten
```

Mit den Standardwerten in der Jenkinsfile und Branch `main`:

```text
http://54.80.83.95/api/fr26-im23ab/main/api/shorten
```

Healthcheck Endpoint:

```text
GET /health
```

Hinweis: Für ein produktives Setup sollten DB-Credentials als Jenkins-Secrets statt Klartext-Variablen verwendet werden.

## GitHub Pages (optional Frontend)

Das Frontend kann weiterhin statisch über GitHub Pages ausgeliefert werden. Dafür bleibt [index.html](index.html) im Repository-Root und ruft das Backend über `URL_SHORTENER_API_BASE` auf.

## Features

- URL kürzen
- Automatische Weiterleitung beim Aufrufen des Kurzlinks über das Backend (`/:code`)
- URL-Validierung mit Fehlermeldungen
- Kopier-Button für den Kurzlink
