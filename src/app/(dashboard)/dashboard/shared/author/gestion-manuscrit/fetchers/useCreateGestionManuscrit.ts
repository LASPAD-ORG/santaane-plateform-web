import { useState } from 'react';
// import { apiClient } from '@/lib/api/client';
// import { useAlertStore } from '@/stores/alertStore';
import type { GestionManuscritPayload } from '../checkers/validators';
import type { GestionManuscritItem } from './useFetchGestionManuscrit';

/**
 * Custom hook to create a new gestion-manuscrit
 */
export function useCreateGestionManuscrit() {
  const [loading, setLoading] = useState(false);
  // const { showSuccess, showError } = useAlertStore();

  const create = async (payload: GestionManuscritPayload): Promise<GestionManuscritItem> => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below when ready

      // const response = await apiClient.post('/api/v1/gestion-manuscrit', payload);
      // showSuccess('Succès', 'L\'élément a été créé avec succès');
      // return response.data;

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const now = new Date().toISOString();
      const mockItem: GestionManuscritItem = {
        id: Math.random().toString(36).substring(7),
        // BaseManuscrit properties (French names)
        titre: payload.title,
        description: payload.description || '',
        auteurId: 'current-user',
        auteurNom: 'Utilisateur', // TODO: Replace with actual user data
        auteurPrenom: 'Actuel', // TODO: Replace with actual user data
        statut: payload.status || 'brouillon',
        dateCreation: now,
        dateMiseAJour: now,
        contenu: payload.contenu,
        nombreCommentaires: 0,
        // Alias properties (English names)
        title: payload.title,
        status: payload.status || 'brouillon',
        createdAt: now,
        updatedAt: now,
        authorId: 'current-user',
        commentairesMentor: {
          forme: [],
          style: [],
          methodologie: [],
          general: []
        }
      };
      console.log('Mock: Created gestion-manuscrit', mockItem);
      return mockItem;

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de création',
      //   error.response?.data?.message || 'Impossible de créer l\'élément'
      // );
      console.error('Error creating gestion-manuscrit:', error);
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
 * Custom hook to update an existing gestion-manuscrit
 */
export function useUpdateGestionManuscrit() {
  const [loading, setLoading] = useState(false);
  // const { showSuccess, showError } = useAlertStore();

  const update = async (id: string, payload: GestionManuscritPayload): Promise<GestionManuscritItem> => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below when ready

      // const response = await apiClient.put(`/api/v1/gestion-manuscrit/${id}`, payload);
      // showSuccess('Succès', 'L\'élément a été modifié avec succès');
      // return response.data;

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const now = new Date().toISOString();
      const mockItem: GestionManuscritItem = {
        id,
        // BaseManuscrit properties (French names)
        titre: payload.title,
        description: payload.description || '',
        auteurId: 'current-user',
        auteurNom: 'Utilisateur', // TODO: Replace with actual user data
        auteurPrenom: 'Actuel', // TODO: Replace with actual user data
        statut: payload.status || 'brouillon',
        dateCreation: now,
        dateMiseAJour: now,
        contenu: payload.contenu,
        nombreCommentaires: 0,
        // Alias properties (English names)
        title: payload.title,
        status: payload.status || 'brouillon',
        createdAt: now,
        updatedAt: now,
        authorId: 'current-user',
        commentairesMentor: {
          forme: [],
          style: [],
          methodologie: [],
          general: []
        }
      };
      console.log('Mock: Updated gestion-manuscrit', mockItem);
      return mockItem;

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de modification',
      //   error.response?.data?.message || 'Impossible de modifier l\'élément'
      // );
      console.error('Error updating gestion-manuscrit:', error);
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
 * Custom hook to delete a gestion-manuscrit
 */
export function useDeleteGestionManuscrit() {
  const [loading, setLoading] = useState(false);
  // const { showSuccess, showError } = useAlertStore();

  const deleteItem = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      // TODO: Replace mock implementation with real API call
      // Uncomment the lines below when ready

      // await apiClient.delete(`/api/v1/gestion-manuscrit/${id}`);
      // showSuccess('Succès', 'L\'élément a été supprimé avec succès');

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      console.log('Mock: Deleted gestion-manuscrit with id:', id);

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de suppression',
      //   error.response?.data?.message || 'Impossible de supprimer l\'élément'
      // );
      console.error('Error deleting gestion-manuscrit:', error);
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
