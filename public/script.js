const urlInput = document.getElementById('urlInput');
const shortenBtn = document.getElementById('shortenBtn');
const errorMsg = document.getElementById('errorMsg');
const result = document.getElementById('result');
const shortLink = document.getElementById('shortLink');
const copyBtn = document.getElementById('copyBtn');
const copyMsg = document.getElementById('copyMsg');

const configuredApiBase = (window.URL_SHORTENER_API_BASE || '').trim();
const API_BASE_URL = configuredApiBase.replace(/\/$/, '');

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove('hidden');
}

shortenBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  errorMsg.classList.add('hidden');
  result.classList.add('hidden');

  if (!url) {
    showError('Bitte eine URL eingeben.');
    return;
  }

  try {
    new URL(url);
  } catch {
    showError('Ungültige URL. Bitte eine vollständige URL eingeben (z.B. https://example.com).');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.error || 'Fehler beim Erzeugen des Kurzlinks.');
      return;
    }

    shortLink.href = data.shortUrl;
    shortLink.textContent = data.shortUrl;
    result.classList.remove('hidden');
  } catch {
    showError('Backend nicht erreichbar. Prüfe URL_SHORTENER_API_BASE und den Serverstatus.');
  }
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(shortLink.href);
  copyMsg.classList.remove('hidden');
  setTimeout(() => copyMsg.classList.add('hidden'), 2000);
});
