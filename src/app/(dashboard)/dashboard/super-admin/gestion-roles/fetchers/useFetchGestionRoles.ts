import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';

// Define the Role interface based on API model
export interface GestionRolesItem {
  id: number;
  name: string;
  description?: string;
}

/**
 * Custom hook to fetch roles list
 */
export function useFetchGestionRoles() {
  const [data, setData] = useState<GestionRolesItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { showError } = useAlertStore();

  const fetch = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/roles');
      setData(response.data);
      return response.data;
    } catch (error: any) {
      showError(
        'Erreur de chargement',
        error.response?.data?.message || 'Impossible de charger les rôles'
      );
      console.error('Error fetching roles:', error);
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
 * Custom hook to fetch a single role by ID
 */
export function useFetchGestionRolesById() {
  const [data, setData] = useState<GestionRolesItem | null>(null);
  const [loading, setLoading] = useState(false);
  const { showError } = useAlertStore();

  const fetch = async (id: number) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/roles/${id}`);
      setData(response.data);
      return response.data;
    } catch (error: any) {
      showError(
        'Erreur de chargement',
        error.response?.data?.message || 'Impossible de charger ce rôle'
      );
      console.error('Error fetching role by ID:', error);
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
