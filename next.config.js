/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "kampanyaradar-static.b-cdn.net",
				pathname: "/",
			},
		],
	},
	experimental: {
		largePageDataBytes: 800 * 1000,
	},
};

module.exports = nextConfig;