const urlInput = document.getElementById('urlInput');
const shortenBtn = document.getElementById('shortenBtn');
const errorMsg = document.getElementById('errorMsg');
const result = document.getElementById('result');
const shortLink = document.getElementById('shortLink');
const copyBtn = document.getElementById('copyBtn');
const copyMsg = document.getElementById('copyMsg');

const STORAGE_KEY = 'url-shortener:links';

function loadLinks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveLinks(links) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

function buildShortUrl(code) {
  const baseUrl = new URL('.', window.location.href);
  return `${baseUrl.href}?code=${encodeURIComponent(code)}`;
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove('hidden');
}

function generateCode() {
  return Math.random().toString(36).slice(2, 8);
}

const redirectCode = new URLSearchParams(window.location.search).get('code');

if (redirectCode) {
  const links = loadLinks();
  const targetUrl = links[redirectCode];

  if (targetUrl) {
    window.location.replace(targetUrl);
  } else {
    showError('Kurzlink nicht gefunden.');
  }
}

shortenBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  errorMsg.classList.add('hidden');
  result.classList.add('hidden');

  if (!url) {
    errorMsg.textContent = 'Bitte eine URL eingeben.';
    errorMsg.classList.remove('hidden');
    showError('Ungültige URL. Bitte eine vollständige URL eingeben (z.B. https://example.com).');

  const res = await fetch('/api/shorten', {
    method: 'POST',
  const links = loadLinks();
  let code = Object.entries(links).find(([, storedUrl]) => storedUrl === url)?.[0];

  if (!code) {
    do {
      code = generateCode();
    } while (links[code]);

    links[code] = url;
    saveLinks(links);
  }

  const shortUrl = buildShortUrl(code);
  shortLink.href = shortUrl;
  shortLink.textContent = shortUrl;

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(shortLink.href);
  copyMsg.classList.remove('hidden');
  setTimeout(() => copyMsg.classList.add('hidden'), 2000);
});
