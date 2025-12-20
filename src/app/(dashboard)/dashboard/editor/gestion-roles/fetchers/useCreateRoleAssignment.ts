import { useState } from 'react';
import type { RoleAssignmentPayload } from '../checkers/validators';
import type { RoleAssignmentItem } from './useFetchRoleAssignments';

export function useCreateRoleAssignment() {
  const [loading, setLoading] = useState(false);

  const create = async (
    payload: RoleAssignmentPayload
  ): Promise<RoleAssignmentItem | null> => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/role-assignments
      // const response = await apiClient.post('/editor/role-assignments', payload);
      // return response.data;

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newAssignment: RoleAssignmentItem = {
        id: String(Date.now()),
        userId: 'user-temp',
        userName: 'Nouvel utilisateur',
        userEmail: payload.userEmail,
        role: payload.role,
        laboratoryId: payload.laboratoryId,
        laboratoryName: 'Laboratoire',
        isActive: true,
        assignedAt: new Date().toISOString(),
        assignedBy: 'user-1',
        assignedByName: 'Dr. Hassan Bamba',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Attribution de rôle créée (mock):', newAssignment);
      return newAssignment;
    } catch (error) {
      console.error('Error creating role assignment:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}

export function useDeactivateRoleAssignment() {
  const [loading, setLoading] = useState(false);

  const deactivate = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/role-assignments/:id/deactivate
      // await apiClient.patch(`/editor/role-assignments/${id}/deactivate`);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('Attribution de rôle désactivée (mock):', id);
      return true;
    } catch (error) {
      console.error('Error deactivating role assignment:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deactivate, loading };
}

export function useReactivateRoleAssignment() {
  const [loading, setLoading] = useState(false);

  const reactivate = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/role-assignments/:id/reactivate
      // await apiClient.patch(`/editor/role-assignments/${id}/reactivate`);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('Attribution de rôle réactivée (mock):', id);
      return true;
    } catch (error) {
      console.error('Error reactivating role assignment:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { reactivate, loading };
}
