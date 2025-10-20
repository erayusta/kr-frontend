/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["kampanyaradar-static.b-cdn.net"],
	},
	experimental: {
		largePageDataBytes: 800 * 1000,
	},
};

module.exports = nextConfig;