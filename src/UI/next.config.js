/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*'
      },
      {
        source: '/data/:path*',
        destination: 'http://localhost:8080/data/:path*'
      }
    ]
  }, ...nextConfig
}
