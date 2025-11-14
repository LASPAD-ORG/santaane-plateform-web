import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';

// Define the test-page item interface
export interface TestPageItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  // Add more fields based on your API response
}

/**
 * Custom hook to fetch test-page list
 */
export function useFetchTestPage() {
  const [data, setData] = useState<TestPageItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { showError } = useAlertStore();

  const fetch = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint simulate API call
      //const response = await apiClient.get('/api/v1/test-page');
      // mock data
      const TestPageItems: TestPageItem[] = [
        {
          id: '1',
          title: 'Premier TestPage',
          description: 'Ceci est la description du premier test-page.',
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authorId: 'user-123',
        }]
      setData(TestPageItems);
      return "test";
    } catch (error: any) {
      showError(
        'Erreur de chargement',
        error.response?.data?.message || 'Impossible de charger les test-page'
      );
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
 * Custom hook to fetch a single test-page by ID
 */
export function useFetchTestPageById() {
  const [data, setData] = useState<TestPageItem | null>(null);
  const [loading, setLoading] = useState(false);
  const { showError } = useAlertStore();

  const fetch = async (id: string) => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await apiClient.get(`/api/v1/test-page/${id}`);
      setData(response.data);
      return response.data;
    } catch (error: any) {
      showError(
        'Erreur de chargement',
        error.response?.data?.message || 'Impossible de charger cet élément'
      );
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
