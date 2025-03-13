/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing code ...
  output: 'standalone',
  experimental: {
    // ... existing experimental options ...
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
      ],
    },
  },
  distDir: '.next',
}

export default nextConfig; 