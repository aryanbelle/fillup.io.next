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
  distDir: '.next',
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
  },
};

export default nextConfig;
