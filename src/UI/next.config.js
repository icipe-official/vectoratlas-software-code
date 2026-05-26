/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    proxyTimeout: 120000,
  },
};

module.exports = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/vector-api/:path*',
        destination: 'http://localhost:3000/:path*',
      },
      {
        source: '/data/:path*',
        destination: 'http://localhost:3000/data/:path*',
      },
    ];
  },
  ...nextConfig,
};
