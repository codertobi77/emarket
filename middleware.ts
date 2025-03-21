import { clerkMiddleware, getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// Define public routes that don't require authentication
export const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signin/(.*)',
  '/auth/signup',
  '/auth/signup/(.*)',
];

// Define routes that require authentication with specific roles
export const roleBasedRoutes = {
  admin: ['/admin/(.*)'],
  client: ['/client/(.*)'],
  seller: ['/seller/(.*)'],
};

// Custom middleware function to check authentication and roles
export async function checkAuth(req: NextRequest) {
  const { userId, sessionClaims } = await getAuth(req);
  const path = req.nextUrl.pathname;
  
  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some(pattern => {
    const regex = new RegExp(`^${pattern.replace(/\(.*\)/g, '.*')}$`);
    return regex.test(path);
  });

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If the user is not authenticated, redirect to sign-in
  if (!userId) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Get the user's role from metadata
  const userRole = (sessionClaims?.public_metadata as { role?: string })?.role || 'client';

  // Check if the path requires a specific role
  for (const [role, routes] of Object.entries(roleBasedRoutes)) {
    const isRoleRoute = routes.some(route => {
      const regex = new RegExp(`^${route.replace(/\(.*\)/g, '.*')}$`);
      return regex.test(path);
    });

    // If the path requires a role that the user doesn't have, redirect to home
    if (isRoleRoute && userRole !== role) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Allow access to the route
  return NextResponse.next();
}

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