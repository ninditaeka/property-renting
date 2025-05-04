/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This will still show errors in your IDE but won't fail the build
    ignoreBuildErrors: true,
  },
  eslint: {
    // This won't run ESLint during build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
