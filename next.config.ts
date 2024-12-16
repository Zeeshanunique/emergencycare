/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true  // Use cautiously
  }
};

module.exports = nextConfig;
