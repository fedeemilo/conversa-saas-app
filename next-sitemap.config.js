/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: 'https://eduvoice.ai',
	generateRobotsTxt: true,
	outDir: 'public',
	additionalPaths: async () => {
		return [
			{ loc: '/', changefreq: 'daily', priority: 1.0 },
			{ loc: '/sign-in', changefreq: 'monthly', priority: 0.3 },
			{ loc: '/subscription', changefreq: 'monthly', priority: 0.5 },
			{ loc: '/my-journey', changefreq: 'weekly', priority: 0.8 },
			{ loc: '/companions', changefreq: 'weekly', priority: 0.8 },
			{ loc: '/companions/new', changefreq: 'monthly', priority: 0.6 }
		]
	}
}
