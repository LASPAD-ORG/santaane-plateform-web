import { create } from 'zustand';
import axios from 'axios';
import type { AuthState, RegisterPayload, User } from '@/types/auth';

// Use Next.js API routes (not backend directly)
// These routes handle HTTP-Only cookies and proxy to backend
const API_BASE = '/api/auth';

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

      // Call login API route
      await axios.post(`${API_BASE}/login`, { email, password });

      // Fetch user data after login
      const response = await axios.get<User>(`${API_BASE}/me`);
      const user = response.data;

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

      // Call register API route
      await axios.post(`${API_BASE}/register`, data);

      // Fetch user data after registration (auto-login)
      const response = await axios.get<User>(`${API_BASE}/me`);
      const user = response.data;

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
      await axios.post(`${API_BASE}/logout`);
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

      // Fetch current user - API route checks HTTP-Only cookie
      const response = await axios.get<User | null>(`${API_BASE}/me`);
      const user = response.data;

      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      // If fetching user fails (no cookie or invalid token), clear auth state
      // This is expected behavior when not logged in, so we don't log the error
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
