import axios from 'axios';
import type { RegisterPayload, User } from '@/types/auth';

/**
 * Authentication service using secure Next.js API routes
 *
 * SECURITY:
 * - All requests go through Next.js API routes (not directly to backend)
 * - Tokens are stored as HTTP-Only cookies (inaccessible from JavaScript)
 * - User data is NEVER stored client-side, always fetched from server
 */

const API_BASE = '/api/auth'; // Next.js API routes

/**
 * Login user with email and password
 * Token is automatically stored as HTTP-Only cookie by the API route
 */
export async function login(email: string, password: string): Promise<User> {
  try {
    // Call Next.js API route (not backend directly)
    await axios.post(`${API_BASE}/login`, { email, password });

    // After login, fetch user data
    return await getCurrentUser();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Register a new user
 * Automatically logs in the user after registration
 */
export async function register(data: RegisterPayload): Promise<User> {
  try {
    // Call Next.js API route
    await axios.post(`${API_BASE}/register`, data);

    // User is automatically logged in, fetch user data
    return await getCurrentUser();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Get current authenticated user
 * The API route will check the HTTP-Only cookie
 */
export async function getCurrentUser(): Promise<User> {
  try {
    // Call Next.js API route which has access to HTTP-Only cookie
    const response = await axios.get<User>(`${API_BASE}/me`);
    return response.data;
  } catch (error) {
    // Don't log error - 401 is expected when not authenticated
    throw error;
  }
}

/**
 * Logout user
 * Clears the HTTP-Only cookie
 */
export async function logout(): Promise<void> {
  try {
    // Call Next.js API route to clear cookie
    await axios.post(`${API_BASE}/logout`);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}
