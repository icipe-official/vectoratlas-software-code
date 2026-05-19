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
        destination: 'http://localhost:3001/:path*',
      },
      {
        source: '/data/:path*',
        destination: 'http://localhost:8080/data/:path*',
      },
      {
        source: '/help',
        destination: 'http://localhost:3002/', // Docusaurus port
      },
      {
        source: '/help/:path*',
        destination: 'http://localhost:3002/:path*',
      },
    ];
  },
  ...nextConfig,
};
