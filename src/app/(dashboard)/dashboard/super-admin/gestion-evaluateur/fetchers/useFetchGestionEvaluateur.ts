import { useState } from 'react';
// import { apiClient } from '@/lib/api/client';
// import { useAlertStore } from '@/stores/alertStore';

// Define the gestion-evaluateur item interface
export interface GestionEvaluateurItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  // Add more fields based on your API response
}

// Mock data for testing - Remove this when connecting to real API
const MOCK_DATA: GestionEvaluateurItem[] = [
  {
    id: '1',
    title: 'Exemple 1',
    description: 'Ceci est un exemple de gestion-evaluateur',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: 'user-1',
  },
  {
    id: '2',
    title: 'Exemple 2',
    description: 'Un autre exemple de gestion-evaluateur',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: 'user-1',
  },
  {
    id: '3',
    title: 'Exemple 3',
    description: 'Encore un exemple de gestion-evaluateur',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: 'user-2',
  },
];

/**
 * Custom hook to fetch gestion-evaluateur list
 */
export function useFetchGestionEvaluateur() {
  const [data, setData] = useState<GestionEvaluateurItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  // const { showError } = useAlertStore();

  const fetch = async () => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below and remove the mock data when ready

      // const response = await apiClient.get('/api/v1/gestion-evaluateur');
      // setData(response.data);
      // return response.data;

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      setData(MOCK_DATA);
      return MOCK_DATA;

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de chargement',
      //   error.response?.data?.message || 'Impossible de charger les gestion-evaluateur'
      // );
      console.error('Error fetching gestion-evaluateur:', error);
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
 * Custom hook to fetch a single gestion-evaluateur by ID
 */
export function useFetchGestionEvaluateurById() {
  const [data, setData] = useState<GestionEvaluateurItem | null>(null);
  const [loading, setLoading] = useState(false);
  // const { showError } = useAlertStore();

  const fetch = async (id: string) => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below and remove the mock data when ready

      // const response = await apiClient.get(`/api/v1/gestion-evaluateur/${id}`);
      // setData(response.data);
      // return response.data;

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const mockItem = MOCK_DATA.find((item) => item.id === id) || MOCK_DATA[0];
      setData(mockItem);
      return mockItem;

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de chargement',
      //   error.response?.data?.message || 'Impossible de charger cet élément'
      // );
      console.error('Error fetching gestion-evaluateur by ID:', error);
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
