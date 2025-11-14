import axios, { AxiosError } from 'axios';

/**
 * API client for making requests to backend
 *
 * SECURITY NOTE:
 * - This client is now only used for non-auth requests (articles, etc.)
 * - Auth requests should go through /api/auth routes
 * - Token is automatically included via HTTP-Only cookies
 */

// Create axios instance for client-side API calls
export const apiClient = axios.create({
  baseURL: '/api', // Use Next.js API routes as proxy
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true, // Important: Include cookies in requests
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
