import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Function to get token from cookies
function getToken(request: NextRequest): string | undefined {
  return request.cookies.get('token')?.value;
}

// Function to get user data from cookies
function getUser(request: NextRequest) {
  const userCookie = request.cookies.get('user')?.value;
  if (userCookie) {
    try {
      return JSON.parse(userCookie);
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      return null;
    }
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for auth page itself and static files
  if (
    pathname === '/auth' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/unauthorized' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Protected routes that need authentication
  const protectedRoutes = ['/customer', '/tenant'];

  // Role-based routes with allowed roles
  const roleBasedRoutes = {
    '/customer': ['customer', 'admin'],
    '/tenant': ['tenant', 'admin'],
  };

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Only check auth for protected routes
  if (isProtectedRoute) {
    // Get token from cookie
    const token = getToken(request);

    // If no token, redirect to login
    if (!token) {
      console.log('No token found, redirecting to auth');
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Get user from cookie (already parsed from JSON)
    const user = getUser(request);

    // If no user data, redirect to login
    if (!user) {
      console.log('No user data found, redirecting to auth');
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Get user role from user data
    const userRole = user.role;

    // Check role-based permissions
    for (const [routePrefix, allowedRoles] of Object.entries(roleBasedRoutes)) {
      if (
        (pathname === routePrefix || pathname.startsWith(`${routePrefix}/`)) &&
        !allowedRoles.includes(userRole)
      ) {
        console.log(`User with role ${userRole} tried to access ${pathname}`);
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Configure paths processed by middleware
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
