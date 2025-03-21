'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

/**
 * Component that handles role-based redirection after authentication
 * Redirects users to their appropriate dashboard based on their role
 */
const RoleBasedRedirect = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run redirection logic if user data is loaded and user is authenticated
    if (!isLoaded || !user) return;

    // Skip redirection if user is already on a role-specific page
    if (
      pathname.startsWith('/admin') || 
      pathname.startsWith('/client') || 
      pathname.startsWith('/seller') ||
      pathname.startsWith('/auth') ||
      pathname === '/profile'
    ) {
      return;
    }

    // Get the user's role from metadata
    const role = user.publicMetadata?.role as string || 'client';

    // Redirect based on role
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else if (role === 'seller') {
      router.push('/seller/dashboard');
    } else if (role === 'client') {
      router.push('/client/markets');
    }
  }, [isLoaded, user, router, pathname]);

  // This component doesn't render anything
  return null;
};

export default RoleBasedRedirect;