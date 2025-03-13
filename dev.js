// Set NODE_OPTIONS environment variable to increase memory limit
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Run the Next.js development server
require('next/dist/bin/next'); 