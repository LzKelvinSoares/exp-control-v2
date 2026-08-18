import type { NextConfig } from 'next'
import withSerwistInit from '@serwist/next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['mongoose'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
}

const isDev = process.env.NODE_ENV === 'development'

export default isDev
  ? nextConfig
  : withSerwistInit({ swSrc: 'app/sw.ts', swDest: 'public/sw.js' })(nextConfig)
