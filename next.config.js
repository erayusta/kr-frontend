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
			{
				protocol: "https",
				hostname: "kampanyaradar.s3.us-east-1.amazonaws.com",
				port: "",
				pathname: "/**",
			},
		],
	},
	experimental: {
		largePageDataBytes: 800 * 1000,
	},
};

module.exports = nextConfig;
