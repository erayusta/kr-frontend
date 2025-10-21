/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["kampanyaradar-static.b-cdn.net"],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'kampanyaradar-static.b-cdn.net',
				port: '',
				pathname: '/kampanyaradar/**',
			},
		],
	},
	experimental: {
		largePageDataBytes: 800 * 1000,
	},
};

module.exports = nextConfig;