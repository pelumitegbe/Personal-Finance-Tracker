// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Enable SWC minification for better performance
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;

