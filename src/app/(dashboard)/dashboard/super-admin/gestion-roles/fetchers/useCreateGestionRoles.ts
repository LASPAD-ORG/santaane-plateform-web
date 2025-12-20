import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';
import type { GestionRolesPayload } from '../checkers/validators';
import type { GestionRolesItem } from './useFetchGestionRoles';

/**
 * Custom hook to create a new role
 */
export function useCreateGestionRoles() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const create = async (payload: GestionRolesPayload): Promise<GestionRolesItem> => {
    setLoading(true);
    try {
      const response = await apiClient.post('/roles', payload);
      showSuccess('Succès', 'Le rôle a été créé avec succès');
      return response.data;
    } catch (error: any) {
      showError(
        'Erreur de création',
        error.response?.data?.message || 'Impossible de créer le rôle'
      );
      console.error('Error creating role:', error);
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
 * Custom hook to update an existing role
 */
export function useUpdateGestionRoles() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const update = async (id: number, payload: GestionRolesPayload): Promise<GestionRolesItem> => {
    setLoading(true);
    try {
      const response = await apiClient.put(`/roles/${id}`, payload);
      showSuccess('Succès', 'Le rôle a été modifié avec succès');
      return response.data;
    } catch (error: any) {
      showError(
        'Erreur de modification',
        error.response?.data?.message || 'Impossible de modifier le rôle'
      );
      console.error('Error updating role:', error);
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
 * Custom hook to delete a role
 */
export function useDeleteGestionRoles() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const deleteItem = async (id: number): Promise<void> => {
    setLoading(true);
    try {
      await apiClient.delete(`/roles/${id}`);
      showSuccess('Succès', 'Le rôle a été supprimé avec succès');
    } catch (error: any) {
      showError(
        'Erreur de suppression',
        error.response?.data?.message || 'Impossible de supprimer le rôle'
      );
      console.error('Error deleting role:', error);
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
