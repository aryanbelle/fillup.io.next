import { authMiddleware, clerkClient, getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function runs before Clerk's auth middleware
const beforeAuthMiddleware = (req: NextRequest) => {
  // Get the pathname from the URL
  const path = req.nextUrl.pathname;
  
  // Define routes that need to be redirected to the root directory
  const routesToRedirect = [
    '/dashboard',
    '/myforms',
    '/newform',
    '/ai',
    '/settings',
    '/security',
    '/form'
  ];
  
  // Check if the current path needs to be redirected
  const shouldRedirect = routesToRedirect.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  // If the path needs to be redirected, redirect to the root directory
  if (shouldRedirect) {
    // Create the new URL with the root prefix
    const newPath = path.replace(/^\//, '/root/');
    return NextResponse.redirect(new URL(newPath, req.url));
  }
  
  // Continue to Clerk's auth middleware
  return NextResponse.next();
};

// This function runs after Clerk's auth middleware
const afterAuthMiddleware = (auth: ReturnType<typeof getAuth>, req: NextRequest) => {
  // Handle any post-authentication logic here if needed
  return NextResponse.next();
};

export default authMiddleware({
  beforeAuth: beforeAuthMiddleware,
  afterAuth: afterAuthMiddleware,
  publicRoutes: [
    '/',
    '/signin',
    '/signup',
    '/api/webhook',
    '/api/(.*)' // Allow all API routes to be public
  ]
});

export const config = {
  matcher: [
    // Match all paths except static files, api routes, and _next
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)",
  ],
};
