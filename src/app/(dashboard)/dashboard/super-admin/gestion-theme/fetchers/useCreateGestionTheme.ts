import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';
import type { GestionThemePayload } from '../checkers/validators';
import type { GestionThemeItem } from './useFetchGestionTheme';

/**
 * Custom hook to create a new gestion-theme
 */
export function useCreateGestionTheme() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const create = async (payload: GestionThemePayload): Promise<GestionThemeItem> => {
    setLoading(true);
    try {
        const response = await apiClient.post('/themes', payload);
      showSuccess('Succès', 'Le thème a été créé avec succès');
      return response.data;

    } catch (error: any) {
      showError(
        'Erreur de création',
        error.response?.data?.detail || 'Impossible de créer le thème'
      );
      console.error('Error creating theme:', error);
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
 * Custom hook to update an existing gestion-theme
 */
export function useUpdateGestionTheme() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const update = async (id: number, payload: GestionThemePayload): Promise<GestionThemeItem> => {
    setLoading(true);
    try {
      const response = await apiClient.put(`/themes/${id}`, payload);
      showSuccess('Succès', 'Le thème a été modifié avec succès');
      return response.data;

    } catch (error: any) {
      showError(
        'Erreur de modification',
        error.response?.data?.detail || 'Impossible de modifier le thème'
      );
      console.error('Error updating theme:', error);
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
 * Custom hook to delete a gestion-theme
 */
export function useDeleteGestionTheme() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const deleteItem = async (id: number): Promise<void> => {
    setLoading(true);
    try {
      await apiClient.delete(`/themes/${id}`);
      showSuccess('Succès', 'Le thème a été supprimé avec succès');

    } catch (error: any) {
      showError(
        'Erreur de suppression',
        error.response?.data?.detail || 'Impossible de supprimer le thème'
      );
      console.error('Error deleting theme:', error);
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
