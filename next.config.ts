import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Specifically handle SurrealDB WASM package
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:fs': 'empty-module',
      'node:path': 'path-browserify',
      'node:crypto': 'crypto-browserify',
      'node:stream': 'stream-browserify',
      'node:buffer': 'buffer',
      'node:util': 'util',
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        util: require.resolve('util'),
      }
    }

    // Add polyfills
    // config.plugins.push(
    //   new config.constructor.ProvidePlugin({
    //     Buffer: ['buffer', 'Buffer'],
    //     process: 'process/browser',
    //   })
    // )

    return config
  },
}

export default nextConfig
