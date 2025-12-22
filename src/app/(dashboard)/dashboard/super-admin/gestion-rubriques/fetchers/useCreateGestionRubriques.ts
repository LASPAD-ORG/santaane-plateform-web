import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';
import type { GestionRubriquesPayload } from '../checkers/validators';
import type { GestionRubriquesItem } from './useFetchGestionRubriques';

// Define the payload interface for sections
export interface SectionPayload {
  name: string;
  signe_min: number;
  signe_max: number;
}

/**
 * Custom hook to create a new gestion-rubriques
 */
export function useCreateGestionRubriques() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const create = async (payload: SectionPayload): Promise<GestionRubriquesItem> => {
    setLoading(true);
    try {
      const response = await apiClient.post('/sections', payload);
      showSuccess('Succès', 'La section a été créée avec succès');
      return response.data;

    } catch (error: any) {
      showError(
        'Erreur de création',
        error.response?.data?.detail || 'Impossible de créer la section'
      );
      console.error('Error creating section:', error);
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
 * Custom hook to update an existing gestion-rubriques
 */
export function useUpdateGestionRubriques() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const update = async (id: number, payload: SectionPayload): Promise<GestionRubriquesItem> => {
    setLoading(true);
    try {
      const response = await apiClient.put(`/sections/${id}`, payload);
      showSuccess('Succès', 'La section a été modifiée avec succès');
      return response.data;

    } catch (error: any) {
      showError(
        'Erreur de modification',
        error.response?.data?.detail || 'Impossible de modifier la section'
      );
      console.error('Error updating section:', error);
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
 * Custom hook to delete a gestion-rubriques
 */
export function useDeleteGestionRubriques() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const deleteItem = async (id: number): Promise<void> => {
    setLoading(true);
    try {
      await apiClient.delete(`/sections/${id}`);
      showSuccess('Succès', 'La section a été supprimée avec succès');

    } catch (error: any) {
      showError(
        'Erreur de suppression',
        error.response?.data?.detail || 'Impossible de supprimer la section'
      );
      console.error('Error deleting section:', error);
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
