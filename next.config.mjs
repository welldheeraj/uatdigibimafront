/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://stage.digibima.com/api/:path*', // note /api here
      },
    ];
  },
};

export default nextConfig;