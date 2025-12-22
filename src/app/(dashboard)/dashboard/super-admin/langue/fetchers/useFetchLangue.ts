import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';

// Define the Language interface based on API model
export interface LangueItem {
  id: number;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

/**
 * Custom hook to fetch langue list
 */
export function useFetchLangue() {
  const [data, setData] = useState<LangueItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { showError } = useAlertStore();

  const fetch = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/languages');
      setData(response.data);
      return response.data;

    } catch (error: any) {
      showError(
        'Erreur de chargement',
        error.response?.data?.detail || 'Impossible de charger les langues'
      );
      console.error('Error fetching languages:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    fetch,
    refresh: fetch,
  };
}

/**
 * Custom hook to fetch a single langue by ID
 */
export function useFetchLangueById() {
  const [data, setData] = useState<LangueItem | null>(null);
  const [loading, setLoading] = useState(false);
  const { showError } = useAlertStore();

  const fetch = async (id: number) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/languages/${id}`);
      setData(response.data);
      return response.data;

    } catch (error: any) {
      showError(
        'Erreur de chargement',
        error.response?.data?.detail || 'Impossible de charger cette langue'
      );
      console.error('Error fetching language by ID:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    fetch,
  };
}
