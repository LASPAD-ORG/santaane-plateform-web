import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';
import {
  User,
  CreateUserData,
  UpdateUserData,
  BackendUser,
  UserStatus
} from './useFetchGestionUtilisateurs';
import {
  mapFrontendUserToBackendUpdate,
  mapFrontendUserToBackendCreate,
  mapBackendUserToFrontend
} from '../helpers/formatters';

/**
 * Custom hook for write operations in gestion-utilisateurs
 */
export function useCreateGestionUtilisateurs() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const createUser = async (data: CreateUserData): Promise<User> => {
    setLoading(true);
    let newUser: User | null = null;
    let roleAssignmentFailed = false;

    try {
      const { payload, temporaryPassword } = mapFrontendUserToBackendCreate(data);
      const response = await apiClient.post<BackendUser>('/users', payload);
      newUser = mapBackendUserToFrontend(response.data);

      // Assign roles after creation
      if (data.roleIds && data.roleIds.length > 0) {
        try {
          for (const roleId of data.roleIds) {
            console.log(`Assigning role ${roleId} to user ${newUser.id}`);
            await apiClient.post('/roles/assign', {
              user_id: newUser.id,
              role_id: roleId,
            });
          }
        } catch (roleError: any) {
          console.error('Error assigning roles:', roleError);
          roleAssignmentFailed = true;
          // Don't throw yet - continue to email
          showError(
            'Attention',
            `L'utilisateur a été créé mais l'assignation des rôles a échoué. Veuillez réessayer via la modification de l'utilisateur. Erreur: ${roleError.response?.data?.error || roleError.message}`
          );
        }
      }

      // Re-fetch user to get updated roles from backend (only if role assignment didn't fail)
      let userWithRoles = newUser;
      if (!roleAssignmentFailed) {
        try {
          const updatedResponse = await apiClient.get<BackendUser>(`/users/${newUser.id}`);
          userWithRoles = mapBackendUserToFrontend(updatedResponse.data);
        } catch (fetchError) {
          console.error('Error fetching updated user:', fetchError);
          // Use the original user data
        }
      }

      // Afficher le message de succès
      if (!roleAssignmentFailed) {
        showSuccess('Succès', 'Utilisateur créé avec succès');
      }

      return userWithRoles;
    } catch (error: any) {
      // If user was created but role assignment failed
      if (newUser) {
        if (roleAssignmentFailed) {
          // Show success with warning about role assignment
          showSuccess(
            'Utilisateur créé avec succès',
            'L\'utilisateur a été créé mais l\'assignation des rôles a échoué. Vous pouvez réessayer en modifiant l\'utilisateur.'
          );
          return newUser;
        }
        // If we have a newUser but no roleAssignmentFailed, it's a different error
        showError(
          'Attention',
          'L\'utilisateur a été créé mais une erreur est survenue. Veuillez vérifier les détails et réessayer.'
        );
        return newUser;
      }

      // If we get here, user creation itself failed
      showError(
        'Erreur de création',
        error.response?.data?.error || 'Impossible de créer l\'utilisateur'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, data: UpdateUserData, currentRoleIds: number[] = []): Promise<User> => {
    setLoading(true);
    try {
      const payload = mapFrontendUserToBackendUpdate(data);
      const response = await apiClient.put<BackendUser>(`/users/${id}`, payload);

      // Handle role changes if roleIds are provided
      if (data.roleIds) {
        const rolesToAdd = data.roleIds.filter(roleId => !currentRoleIds.includes(roleId));
        const rolesToRemove = currentRoleIds.filter(roleId => !data.roleIds?.includes(roleId));

        for (const roleId of rolesToAdd) {
          await apiClient.post('/roles/assign', {
            user_id: id,
            role_id: roleId,
          });
        }

        for (const roleId of rolesToRemove) {
          await apiClient.delete(`/roles/remove/${id}/${roleId}`);
        }
      }

      // Re-fetch user to get updated roles and data from backend
      const updatedResponse = await apiClient.get<BackendUser>(`/users/${id}`);
      const userWithUpdatedRoles = mapBackendUserToFrontend(updatedResponse.data);

      showSuccess('Succès', 'Utilisateur mis à jour avec succès');
      return userWithUpdatedRoles;
    } catch (error: any) {
      showError(
        'Erreur de mise à jour',
        error.response?.data?.error || 'Impossible de mettre à jour l\'utilisateur'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await apiClient.delete(`/users/${id}`);
      showSuccess('Succès', 'Utilisateur supprimé avec succès');
    } catch (error: any) {
      showError(
        'Erreur de suppression',
        error.response?.data?.error || 'Impossible de supprimer l\'utilisateur'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id: string, isActive: boolean): Promise<User> => {
    setLoading(true);
    try {
      await apiClient.post<BackendUser>(`/users/${id}/activate`, {
        isActive,
      });

      // Re-fetch user to get updated data with roles from backend
      const updatedResponse = await apiClient.get<BackendUser>(`/users/${id}`);
      const userWithRoles = mapBackendUserToFrontend(updatedResponse.data);

      showSuccess('Succès', `Utilisateur ${isActive ? 'activé' : 'désactivé'} avec succès`);
      return userWithRoles;
    } catch (error: any) {
      showError(
        'Erreur de statut',
        error.response?.data?.error || 'Impossible de modifier le statut'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (id: string, newPassword: string): Promise<void> => {
    setLoading(true);
    try {
      await apiClient.put(`/users/${id}/reset-password`, { newPassword });
      showSuccess('Succès', 'Mot de passe réinitialisé avec succès');
    } catch (error: any) {
      showError(
        'Erreur',
        error.response?.data?.error || 'Impossible de réinitialiser le mot de passe'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetPassword,
  };
}
