/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
    ],
  },
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        '.next/cache/**',
      ],
    },
  },
}
module.exports = nextConfig
