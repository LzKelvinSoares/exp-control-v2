import type { NextConfig } from 'next'
import withPWA from 'next-pwa'

const nextConfig: NextConfig = {
  images: {
    domains: ['drive.google.com', 'lh3.googleusercontent.com'],
  },
}

const isDev = process.env.NODE_ENV === 'development'

export default isDev
  ? nextConfig
  : withPWA({ dest: 'public', register: true, skipWaiting: true })(nextConfig)
