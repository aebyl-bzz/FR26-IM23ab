const urlInput = document.getElementById('urlInput');
const shortenBtn = document.getElementById('shortenBtn');
const errorMsg = document.getElementById('errorMsg');
const result = document.getElementById('result');
const shortLink = document.getElementById('shortLink');
const copyBtn = document.getElementById('copyBtn');
const copyMsg = document.getElementById('copyMsg');

shortenBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  errorMsg.classList.add('hidden');
  result.classList.add('hidden');

  if (!url) {
    errorMsg.textContent = 'Bitte eine URL eingeben.';
    errorMsg.classList.remove('hidden');
    return;
  }

  const res = await fetch('/api/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  const data = await res.json();

  if (!res.ok) {
    errorMsg.textContent = data.error;
    errorMsg.classList.remove('hidden');
    return;
  }

  shortLink.href = data.shortUrl;
  shortLink.textContent = data.shortUrl;
  result.classList.remove('hidden');
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(shortLink.href);
  copyMsg.classList.remove('hidden');
  setTimeout(() => copyMsg.classList.add('hidden'), 2000);
});
