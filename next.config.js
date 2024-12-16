/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_PAYPLUG_SECRET_KEY: process.env.NEXT_PUBLIC_PAYPLUG_SECRET_KEY || 'sk_test_yugCPCAfcjcBYWEX2UlQw'
  }
}

module.exports = nextConfig
