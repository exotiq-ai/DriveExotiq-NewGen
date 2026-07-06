/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  compress: true,
  poweredByHeader: false,
  // Enable SWC minification
  swcMinify: true,
  // Optimize fonts
  reactStrictMode: true,
  async redirects() {
    return [
      // The film is the home now.
      { source: '/experience', destination: '/', permanent: true },
      // Community folded into the drives.
      { source: '/community', destination: '/drives', permanent: true },
      // Legacy orphans retired to their surviving pillar.
      { source: '/cities', destination: '/tour', permanent: true },
      { source: '/events', destination: '/drives', permanent: true },
      { source: '/how-it-works', destination: '/marketplace', permanent: true },
      { source: '/investors', destination: 'https://summary.exotiq.ai', permanent: true },
      // Wheelbase/Phoenix booking is not on the new site (coming-soon canon).
      { source: '/booking', destination: '/marketplace', permanent: true },
      { source: '/booking/phoenix', destination: '/marketplace', permanent: true },
    ];
  },
};

module.exports = nextConfig;
