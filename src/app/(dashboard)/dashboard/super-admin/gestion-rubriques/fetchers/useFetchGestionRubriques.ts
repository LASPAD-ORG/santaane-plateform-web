import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';

// Define the Section interface based on API model
export interface GestionRubriquesItem {
  id: number;
  name: string;
  signe_min: number;
  signe_max: number;
  created_at: string;
  updated_at: string;
}

/**
 * Custom hook to fetch gestion-rubriques list
 */
export function useFetchGestionRubriques() {
  const [data, setData] = useState<GestionRubriquesItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { showError } = useAlertStore();

  const fetch = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/sections');
      setData(response.data);
      return response.data;

    } catch (error: any) {
      showError(
        'Erreur de chargement',
        error.response?.data?.detail || 'Impossible de charger les sections'
      );
      console.error('Error fetching sections:', error);
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
 * Custom hook to fetch a single gestion-rubriques by ID
 */
export function useFetchGestionRubriquesById() {
  const [data, setData] = useState<GestionRubriquesItem | null>(null);
  const [loading, setLoading] = useState(false);
  const { showError } = useAlertStore();

  const fetch = async (id: number) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/sections/${id}`);
      setData(response.data);
      return response.data;

    } catch (error: any) {
      showError(
        'Erreur de chargement',
        error.response?.data?.detail || 'Impossible de charger cette section'
      );
      console.error('Error fetching section by ID:', error);
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
