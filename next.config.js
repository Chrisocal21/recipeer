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
  }
};

module.exports = nextConfig;
