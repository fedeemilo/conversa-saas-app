/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: 'https://eduvoice.ai',
	generateRobotsTxt: true,
	outDir: 'public',
	additionalPaths: async () => [
		{ loc: '/' },
		{ loc: '/subscription' },
		{ loc: '/my-journey' },
		{ loc: '/companions/new' }
	]
}
