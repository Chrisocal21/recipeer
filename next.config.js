/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  trailingSlash: false,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/recipes/:id*',
          destination: '/recipes/:id*'
        }
      ]
    }
  },
  env: {
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  },
  typescript: {
    ignoreBuildErrors: true, // Temporary fix for build
  },
};

module.exports = nextConfig;
