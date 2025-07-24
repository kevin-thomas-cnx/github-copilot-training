/** @type {import('next').NextConfig} */
require('dotenv').config({ path: '.env.secrets' });
const nextConfig = {
  reactStrictMode: true,
  // Add other configurations here if needed
  // For example, if your external API requires image domains:
  // images: {
  //   domains: ['your-image-api-domain.com'],
  // },
}

module.exports = nextConfig
