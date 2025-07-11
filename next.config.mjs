// next.config.js

/** @type {import('next').NextConfig} */
import nextPWA from 'next-pwa'
const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default withPWA(nextConfig)
