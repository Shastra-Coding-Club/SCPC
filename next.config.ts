import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Compiler for automatic optimizations
  reactCompiler: true,

  // Experimental features for performance
  experimental: {
    // Optimize package imports for faster builds
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },

  // Enable compression
  compress: true,

  // Generate ETags for caching
  generateEtags: true,

  // Power optimizations
  poweredByHeader: false,

  // Strict mode for better debugging
  reactStrictMode: true,

  // Proxy API requests to avoid CORS
  async rewrites() {
    return [
      {
        source: '/api/query',
        destination: 'http://13.232.213.189:5000/api/query',
      },
    ];
  },
};

export default nextConfig;
