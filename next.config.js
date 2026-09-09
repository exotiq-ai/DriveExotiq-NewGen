/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    // WebP keeps cold image transforms fast and predictable for this photo set.
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  compress: true,
  poweredByHeader: false,
  // Optimize fonts
  reactStrictMode: true,
  async redirects() {
    return [
      // Preserve already-shared preview media URLs after the directory cleanup.
      {
        source: "/astra/:path*",
        destination: "/media/:path*",
        permanent: true,
      },
      // The film is the home now.
      { source: "/experience", destination: "/", permanent: true },
      // Community folded into the drives.
      { source: "/community", destination: "/drives", permanent: true },
      // Legacy orphans retired to their surviving pillar.
      { source: "/cities", destination: "/tour", permanent: true },
      { source: "/events", destination: "/drives", permanent: true },
      { source: "/how-it-works", destination: "/marketplace", permanent: true },
      {
        source: "/investors",
        destination: "https://summary.exotiq.ai",
        permanent: true,
      },
      // Wheelbase/Phoenix booking is not on the new site (coming-soon canon).
      { source: "/booking", destination: "/marketplace", permanent: true },
      {
        source: "/booking/phoenix",
        destination: "/marketplace",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
