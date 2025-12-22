import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';
import type { LanguePayload } from '../checkers/validators';
import type { LangueItem } from './useFetchLangue';

/**
 * Custom hook to create a new langue
 */
export function useCreateLangue() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const create = async (payload: LanguePayload): Promise<LangueItem> => {
    setLoading(true);
    try {
      const response = await apiClient.post('/languages', payload);
      showSuccess('Succès', 'La langue a été créée avec succès');
      return response.data;

    } catch (error: any) {
      showError(
        'Erreur de création',
        error.response?.data?.detail || 'Impossible de créer la langue'
      );
      console.error('Error creating language:', error);
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
 * Custom hook to update an existing langue
 */
export function useUpdateLangue() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const update = async (id: number, payload: LanguePayload): Promise<LangueItem> => {
    setLoading(true);
    try {
      const response = await apiClient.put(`/languages/${id}`, payload);
      showSuccess('Succès', 'La langue a été modifiée avec succès');
      return response.data;

    } catch (error: any) {
      showError(
        'Erreur de modification',
        error.response?.data?.detail || 'Impossible de modifier la langue'
      );
      console.error('Error updating language:', error);
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
 * Custom hook to delete a langue
 */
export function useDeleteLangue() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const deleteItem = async (id: number): Promise<void> => {
    setLoading(true);
    try {
      await apiClient.delete(`/languages/${id}`);
      showSuccess('Succès', 'La langue a été supprimée avec succès');

    } catch (error: any) {
      showError(
        'Erreur de suppression',
        error.response?.data?.detail || 'Impossible de supprimer la langue'
      );
      console.error('Error deleting language:', error);
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
