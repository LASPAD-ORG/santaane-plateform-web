/**
 * Route configuration
 */

// Public routes that don't require authentication
export const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

// Routes that should redirect to dashboard if user is authenticated
export const AUTH_REDIRECT_ROUTES = ['/login', '/register'];

// Protected routes that require authentication
export const PROTECTED_ROUTES = ['/dashboard'];

// Super Admin-only routes
export const SUPER_ADMIN_ROUTES = [
  '/dashboard/super-admin',
  '/dashboard/super-admin/laboratories',
  '/dashboard/super-admin/users',
  '/dashboard/super-admin/settings',
];

// Editor routes
export const EDITOR_ROUTES = [
  '/dashboard/editor',
  '/dashboard/editor/analytics',
  '/dashboard/editor/content',
];

// Author routes
export const AUTHOR_ROUTES = [
  '/dashboard/author',
  '/dashboard/author/articles',
  '/dashboard/author/drafts',
];

// Reviewer routes
export const REVIEWER_ROUTES = [
  '/dashboard/reviewer',
  '/dashboard/reviewer/review',
  '/dashboard/reviewer/pending',
];

/**
 * Check if a path is a public route
 */
export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some((route) => path.startsWith(route));
}

/**
 * Check if a path is a protected route
 */
export function isProtectedRoute(path: string): boolean {
  return PROTECTED_ROUTES.some((route) => path.startsWith(route));
}

/**
 * Check if a path should redirect authenticated users
 */
export function shouldRedirectAuthenticated(path: string): boolean {
  return AUTH_REDIRECT_ROUTES.some((route) => path.startsWith(route));
}
