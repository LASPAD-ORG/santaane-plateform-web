import { create } from 'zustand';
import type { AuthState, RegisterPayload, User } from '@/types/auth';
import * as authService from '@/services/authService';

/**
 * Authentication store using Zustand
 *
 * SECURITY:
 * - User data is ONLY stored in memory (not in cookies)
 * - Token is stored as HTTP-Only cookie via API routes (inaccessible from JS)
 * - Always fetches fresh user data from server via /api/auth/me
 */

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  /**
   * Login user
   */
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const user = await authService.login(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Register new user
   */
  register: async (data: RegisterPayload) => {
    try {
      set({ isLoading: true });
      const user = await authService.register(data);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await authService.logout();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      // Even if logout fails, clear local state
      set({ user: null, isAuthenticated: false });
      throw error;
    }
  },

  /**
   * Set user data
   */
  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },

  /**
   * Set loading state
   */
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  /**
   * Check authentication status
   * Fetches user data from server via HTTP-Only cookie
   */
  checkAuth: async () => {
    try {
      set({ isLoading: true });

      // Try to fetch current user
      // The API route will check the HTTP-Only cookie
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // If fetching user fails (no cookie or invalid token), clear auth state
      // This is expected behavior when not logged in, so we don't log the error
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
