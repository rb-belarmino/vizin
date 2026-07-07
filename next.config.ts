import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd()
  },
  logging: {
    serverFunctions: false
  },
  serverExternalPackages: ['@prisma/client'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'nrlf3lkiua.ufs.sh',
        pathname: '/**'
      }
    ]
  }
}

export default nextConfig
