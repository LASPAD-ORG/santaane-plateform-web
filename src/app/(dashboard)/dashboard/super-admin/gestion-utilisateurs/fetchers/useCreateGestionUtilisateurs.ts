import { useState } from 'react';
// import { apiClient } from '@/lib/api/client';
// import { useAlertStore } from '@/stores/alertStore';
import type { CreateUserData, UpdateUserData, User, UserStatus } from '../types';

/**
 * Custom hook to create a new user
 */
export function useCreateGestionUtilisateurs() {
  const [loading, setLoading] = useState(false);
  // const { showSuccess, showError } = useAlertStore();

  const create = async (payload: CreateUserData): Promise<User> => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below when ready

      // const response = await apiClient.post('/api/v1/users', payload);
      // showSuccess('Succès', 'L\'utilisateur a été créé avec succès');
      // return response.data;

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        email: payload.email,
        prenom: payload.prenom,
        nom: payload.nom,
        roles: payload.roles,
        status: 'PENDING' as UserStatus,
        laboratoire: payload.laboratoire,
        specialite: payload.specialite,
        telephone: payload.telephone,
        dateCreation: new Date().toISOString(),
        emailVerifie: false,
        isActive: true,
      };
      console.log('Mock: Created user', mockUser);
      return mockUser;

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de création',
      //   error.response?.data?.message || 'Impossible de créer l\'utilisateur'
      // );
      console.error('Error creating user:', error);
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
 * Custom hook to update an existing user
 */
export function useUpdateGestionUtilisateurs() {
  const [loading, setLoading] = useState(false);
  // const { showSuccess, showError } = useAlertStore();

  const update = async (id: string, payload: UpdateUserData): Promise<User> => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below when ready

      // const response = await apiClient.put(`/api/v1/users/${id}`, payload);
      // showSuccess('Succès', 'L\'utilisateur a été modifié avec succès');
      // return response.data;

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const mockUser: User = {
        id,
        email: 'updated@example.com', // This would come from the existing user
        prenom: payload.prenom || 'Updated',
        nom: payload.nom || 'User',
        roles: payload.roles || [],
        status: payload.status || 'ACTIVE' as UserStatus,
        laboratoire: payload.laboratoire,
        specialite: payload.specialite,
        telephone: payload.telephone,
        dateCreation: new Date().toISOString(),
        derniereConnexion: new Date().toISOString(),
        emailVerifie: true,
        isActive: true,
      };
      console.log('Mock: Updated user', mockUser);
      return mockUser;

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de modification',
      //   error.response?.data?.message || 'Impossible de modifier l\'utilisateur'
      // );
      console.error('Error updating user:', error);
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
 * Custom hook to delete a user
 */
export function useDeleteGestionUtilisateurs() {
  const [loading, setLoading] = useState(false);
  // const { showSuccess, showError } = useAlertStore();

  const deleteItem = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      // TODO: Replace mock implementation with real API call
      // Uncomment the lines below when ready

      // await apiClient.delete(`/api/v1/users/${id}`);
      // showSuccess('Succès', 'L\'utilisateur a été supprimé avec succès');

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      console.log('Mock: Deleted user with id:', id);

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de suppression',
      //   error.response?.data?.message || 'Impossible de supprimer l\'utilisateur'
      // );
      console.error('Error deleting user:', error);
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
