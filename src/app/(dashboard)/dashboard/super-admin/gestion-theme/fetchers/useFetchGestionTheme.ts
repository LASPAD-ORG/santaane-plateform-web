import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';

// Define the Theme interface based on API model
export interface GestionThemeItem {
  id: number;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}


/**
 * Custom hook to fetch gestion-theme list
 */
export function useFetchGestionTheme() {
  const [data, setData] = useState<GestionThemeItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { showError } = useAlertStore();

  const fetch = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/themes');
      setData(response.data);
      return response.data;

    } catch (error: any) {
      showError(
        'Erreur de chargement',
        error.response?.data?.detail || 'Impossible de charger les thèmes'
      );
      console.error('Error fetching themes:', error);
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
 * Custom hook to fetch a single gestion-theme by ID
 */
export function useFetchGestionThemeById() {
  const [data, setData] = useState<GestionThemeItem | null>(null);
  const [loading, setLoading] = useState(false);
  const { showError } = useAlertStore();

  const fetch = async (id: number) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/themes/${id}`);
      setData(response.data);
      return response.data;

    } catch (error: any) {
      showError(
        'Erreur de chargement',
        error.response?.data?.detail || 'Impossible de charger ce thème'
      );
      console.error('Error fetching theme by ID:', error);
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
