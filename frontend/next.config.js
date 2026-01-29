/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'}/api/:path*`,
      },
      {
        source: '/ws/:path*',
        destination: `${process.env.NEXT_PUBLIC_WS_URL || 'ws://backend:8000'}/ws/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
