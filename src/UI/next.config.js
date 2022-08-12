/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
}

module.exports = {
  output: 'standalone',
  pageExtensions: ['_app.tsx', 'page.tsx'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*'
      }
    ]
  }, ...nextConfig
}
