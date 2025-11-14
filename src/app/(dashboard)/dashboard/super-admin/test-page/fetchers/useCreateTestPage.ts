import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';
import type { TestPagePayload } from '../checkers/validators';
import type { TestPageItem } from './useFetchTestPage';

/**
 * Custom hook to create a new test-page
 */
export function useCreateTestPage() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const create = async (payload: TestPagePayload): Promise<TestPageItem> => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await apiClient.post('/api/v1/test-page', payload);
      showSuccess(
        'Succès',
        'L\'élément a été créé avec succès'
      );
      return response.data;
    } catch (error: any) {
      showError(
        'Erreur de création',
        error.response?.data?.message || 'Impossible de créer l\'élément'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    create,
    loading,
  };
}

/**
 * Custom hook to update an existing test-page
 */
export function useUpdateTestPage() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const update = async (id: string, payload: TestPagePayload): Promise<TestPageItem> => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await apiClient.put(`/api/v1/test-page/${id}`, payload);
      showSuccess(
        'Succès',
        'L\'élément a été modifié avec succès'
      );
      return response.data;
    } catch (error: any) {
      showError(
        'Erreur de modification',
        error.response?.data?.message || 'Impossible de modifier l\'élément'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    update,
    loading,
  };
}

/**
 * Custom hook to delete a test-page
 */
export function useDeleteTestPage() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const deleteItem = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      await apiClient.delete(`/api/v1/test-page/${id}`);
      showSuccess(
        'Succès',
        'L\'élément a été supprimé avec succès'
      );
    } catch (error: any) {
      showError(
        'Erreur de suppression',
        error.response?.data?.message || 'Impossible de supprimer l\'élément'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteItem,
    loading,
  };
}
