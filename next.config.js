/** @type {import('next').NextConfig} */
module.exports =  {
  reactStrictMode: true,
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kampanyaradar-static.b-cdn.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
   experimental: {
    largePageDataBytes: 800 * 1000,
  },
};


