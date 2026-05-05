const { Selector } = require('testcafe');

fixture('Wikipedia Random Page Test').page(
	'https://en.wikipedia.org/wiki/Special:Random'
);

const MAX_STEPS = 60;

test('Follow first Wikipedia links until Philosophy or loop', async (t) => {
	const visited = new Set();
	const chain = [];
	let reachedPhilosophy = false;

	for (let step = 1; step <= MAX_STEPS; step += 1) {
		const title = await getTitleText(t);
		const pagePath = await getCurrentWikiPath(t);

		chain.push(title);

		if (title === 'Philosophy') {
			reachedPhilosophy = true;
			break;
		}

		const visitKey = `${title}::${pagePath}`;
		if (visited.has(visitKey)) {
			break;
		}
		visited.add(visitKey);

		const nextLink = await getFirstValidLink(t);
		await t.click(nextLink);
		await waitForArticleHeadingChange(t, title);
	}

	const endReason = reachedPhilosophy ? 'PHILOSOPHY' : 'LOOP_OR_LIMIT';
	console.log(`[WIKI-CHAIN] reason=${endReason} steps=${chain.length}`);
	console.log(`[WIKI-CHAIN] start=${chain[0] || 'N/A'} end=${chain[chain.length - 1] || 'N/A'}`);
	console.log(`[WIKI-CHAIN] chain=${chain.join(' -> ')}`);

	await t.expect(chain.length).gt(0);
});

const getTitleText = async (t) => {
	const title = Selector('#firstHeading');
	await t.expect(title.exists).ok({ timeout: 10000 });
	return title.innerText;
};

const getCurrentWikiPath = async (t) => {
	const url = await t.eval(() => window.location.pathname);
	return String(url || '');
};

const waitForArticleHeadingChange = async (t, previousTitle) => {
	const title = Selector('#firstHeading');
	await t.expect(title.exists).ok({ timeout: 10000 });

	await t.expect(title.innerText).notEql(previousTitle, {
		timeout: 15000,
	});
};

const getFirstValidLink = async (t) => {
	const content = Selector('#mw-content-text .mw-parser-output');
	await t.expect(content.exists).ok({ timeout: 10000 });

	const firstValidLink = content
		.find('p a')
		.filter((node) => {
			const href = node.getAttribute('href') || '';
			const isWikiArticle = href.startsWith('/wiki/');
			const isSpecialOrFileLike = href.includes(':');
			const isFragment = href.startsWith('#');
			const isRedLink = node.classList.contains('new');
			const insideIgnoredSection =
				!!node.closest('i') ||
				!!node.closest('em') ||
				!!node.closest('sup') ||
				!!node.closest('.infobox') ||
				!!node.closest('.hatnote') ||
				!!node.closest('.thumb') ||
				!!node.closest('.navbox');

			return (
				isWikiArticle &&
				!isSpecialOrFileLike &&
				!isFragment &&
				!isRedLink &&
				!insideIgnoredSection
			);
		})
		.nth(0);

	await t.expect(firstValidLink.exists).ok({ timeout: 10000 });
	return firstValidLink;
};
