import { clerkMiddleware } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
export const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signin/(.*)',
  '/auth/signup',
  '/auth/signup/(.*)',
  '/profile(.*)', // Allow all profile routes for UserProfile component
];

// Define routes that require authentication with specific roles
export const roleBasedRoutes = {
  admin: ['/admin/(.*)'],
  client: ['/client/(.*)'],
  seller: ['/seller/(.*)'],
};

// Export the middleware
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}