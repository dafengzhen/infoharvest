/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '16mb',
      allowedOrigins: process.env.SERVER_ACTIONS_ALLOWED_ORIGINS
        ? process.env.SERVER_ACTIONS_ALLOWED_ORIGINS.split(',')
        : [],
    },
  },
};

module.exports = nextConfig;
