import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:fs': 'fs',
      'node:path': 'path',
      'node:util': 'util',
      'node:stream': 'stream',
      'node:crypto': 'crypto',
      // Add any other node: modules the library is using
    }

    if (!isServer) {
      // Don't resolve 'fs', 'net', etc. on the client
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
      }
    }
    return config
  },
}

export default nextConfig
