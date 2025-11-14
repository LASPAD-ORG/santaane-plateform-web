/**
 * Cookie utilities
 *
 * SECURITY NOTE:
 * - auth_token is now stored as HTTP-Only cookie via API routes (inaccessible from JavaScript)
 * - user_data is NEVER stored in cookies for security reasons
 * - All authentication is handled server-side via Next.js API routes
 */

// These functions are kept for backwards compatibility but are deprecated
// The actual token is stored as HTTP-Only cookie via /api/auth routes

/**
 * @deprecated Token is now stored as HTTP-Only cookie via API routes
 * This function only exists for compatibility
 */
export function getAuthToken(): string | undefined {
  // Token is HTTP-Only, cannot be accessed from client-side JavaScript
  // This is a security feature
  console.warn('getAuthToken: Token is HTTP-Only and cannot be accessed from client');
  return undefined;
}

/**
 * @deprecated Token is now managed via API routes
 */
export function setAuthToken(token: string): void {
  console.warn('setAuthToken: Token should be set via /api/auth routes only');
}

/**
 * @deprecated Token is now managed via API routes
 */
export function removeAuthToken(): void {
  console.warn('removeAuthToken: Use /api/auth/logout instead');
}

/**
 * @deprecated User data is never stored in cookies for security
 * Always fetch via /api/auth/me
 */
export function getUserData(): string | undefined {
  console.warn('getUserData: User data is never stored in cookies. Use /api/auth/me instead');
  return undefined;
}

/**
 * @deprecated User data should never be stored in cookies
 */
export function setUserData(userData: string): void {
  console.warn('setUserData: User data should never be stored in cookies');
}

/**
 * @deprecated User data is never stored
 */
export function removeUserData(): void {
  // No-op
}

/**
 * @deprecated Use /api/auth/logout instead
 */
export function clearAuthCookies(): void {
  console.warn('clearAuthCookies: Use /api/auth/logout API route instead');
}
