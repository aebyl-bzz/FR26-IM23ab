(() => {
	const pathSegments = window.location.pathname.split('/').filter(Boolean);

	if (pathSegments[0] === 'projects' && pathSegments[1] && pathSegments[2]) {
		window.URL_SHORTENER_API_BASE = `/api/${pathSegments[1]}/${pathSegments[2]}`;
		return;
	}

	window.URL_SHORTENER_API_BASE = '';
})();
