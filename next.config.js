/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export' retiré pour permettre les routes API
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig

