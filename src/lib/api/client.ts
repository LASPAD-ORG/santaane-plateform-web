import axios, { AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Ne pas rediriger automatiquement vers /login
    // Laisser chaque composant gérer le 401 lui-meme
    return Promise.reject(error);
  }
);

export default apiClient;