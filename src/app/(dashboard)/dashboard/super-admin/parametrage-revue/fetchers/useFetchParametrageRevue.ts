import { useState } from 'react';
// import { apiClient } from '@/lib/api/client';
// import { useAlertStore } from '@/stores/alertStore';

// Define the parametrage-revue item interface
export interface ParametrageRevueItem {
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
const MOCK_DATA: ParametrageRevueItem[] = [
  {
    id: '1',
    title: 'Exemple 1',
    description: 'Ceci est un exemple de parametrage-revue',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: 'user-1',
  },
  {
    id: '2',
    title: 'Exemple 2',
    description: 'Un autre exemple de parametrage-revue',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: 'user-1',
  },
  {
    id: '3',
    title: 'Exemple 3',
    description: 'Encore un exemple de parametrage-revue',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: 'user-2',
  },
];

/**
 * Custom hook to fetch parametrage-revue list
 */
export function useFetchParametrageRevue() {
  const [data, setData] = useState<ParametrageRevueItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  // const { showError } = useAlertStore();

  const fetch = async () => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below and remove the mock data when ready

      // const response = await apiClient.get('/api/v1/parametrage-revue');
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
      //   error.response?.data?.message || 'Impossible de charger les parametrage-revue'
      // );
      console.error('Error fetching parametrage-revue:', error);
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
 * Custom hook to fetch a single parametrage-revue by ID
 */
export function useFetchParametrageRevueById() {
  const [data, setData] = useState<ParametrageRevueItem | null>(null);
  const [loading, setLoading] = useState(false);
  // const { showError } = useAlertStore();

  const fetch = async (id: string) => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below and remove the mock data when ready

      // const response = await apiClient.get(`/api/v1/parametrage-revue/${id}`);
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
      console.error('Error fetching parametrage-revue by ID:', error);
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
