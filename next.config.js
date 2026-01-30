/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		unoptimized: true,
		domains: ["kampanyaradar-static.b-cdn.net", "localhost"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "kampanyaradar-static.b-cdn.net",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "8080",
				pathname: "/storage/**",
			},
		],
	},
	experimental: {
		largePageDataBytes: 800 * 1000,
	},
};

module.exports = nextConfig;
