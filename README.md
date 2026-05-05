# URL-Shortener

Eine einfache Web-Applikation, die lange URLs zu kurzen Links verkürzt. Die App ist jetzt als statische Seite aufgebaut und kann direkt über GitHub Pages deployt werden.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** kein Server nötig für das Deployment
- **Speicher:** Browser `localStorage`

## Installation

```bash
npm install
npm start
```

Der lokale Server dient nur als Vorschau und öffnet dieselbe statische Seite wie GitHub Pages.

## GitHub Pages

1. Repository auf GitHub pushen.
2. In den Repository-Einstellungen unter `Pages` den Branch und den Root-Ordner auswählen.
3. Als Startdatei wird die Datei [index.html](index.html) im Repository-Root verwendet.

Wichtig: Die Kurzlinks werden im Browser gespeichert. Sie funktionieren deshalb nur in dem Browser, in dem sie erstellt wurden.

## Features

- URL kürzen
- Automatische Weiterleitung beim Aufrufen des Kurzlinks via Query-Parameter
- URL-Validierung mit Fehlermeldungen
- Kopier-Button für den Kurzlink
