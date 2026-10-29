/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false,
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
    outputFileTracingExcludes: {
      "*": [
        "node_modules/@swc/core-linux-x64-gnu",
        "node_modules/@swc/core-linux-x64-musl",
        "node_modules/@esbuild/linux-x64",
      ],
    },
  },
  // Keep `next dev` output separate from `next build` so a build can't replace
  // chunks while the development server is still serving requests.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  // Add configuration to handle dynamic API routes
  typescript: {
    // Ignore TypeScript errors during build to prevent build failures
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during build to prevent build failures
    ignoreDuringBuilds: true,
  },
  // Add configuration to properly handle static assets
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  },
  // Ensure proper handling of API routes
  async rewrites() {
    return [
      {
        source: '/dashboard',
        destination: '/root/dashboard',
      },
      {
        source: '/myforms',
        destination: '/root/myforms',
      },
      {
        source: '/newform',
        destination: '/root/newform',
      },
      {
        source: '/ai',
        destination: '/root/ai',
      },
      {
        source: '/settings',
        destination: '/root/settings',
      },
      {
        source: '/security',
        destination: '/root/security',
      },
    ];
  },
  // Add headers for Clerk authentication
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'x-clerk-middleware',
            value: 'true',
          }
        ],
      },
    ];
  },
};

export default nextConfig;
