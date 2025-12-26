'use client';

import { useState } from 'react';
import apiClient from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';
import type { Role } from './useFetchRoles';

export interface CreateRoleData {
  name: string;
  description: string;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
}

export const useRoleActions = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const createRole = async (data: CreateRoleData) => {
    setLoading(true);
    try {
      const response = await apiClient.post<Role>('/roles/', data);
      showSuccess('Rôle créé avec succès');
      return response.data;
    } catch (error: any) {
      showError(error.response?.data?.detail || 'Erreur lors de la création du rôle');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id: number, data: UpdateRoleData) => {
    setLoading(true);
    try {
      const response = await apiClient.put<Role>(`/roles/${id}`, data);
      showSuccess('Rôle mis à jour avec succès');
      return response.data;
    } catch (error: any) {
      showError(error.response?.data?.detail || 'Erreur lors de la mise à jour du rôle');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id: number) => {
    setLoading(true);
    try {
      await apiClient.delete(`/roles/${id}`);
      showSuccess('Rôle supprimé avec succès');
    } catch (error: any) {
      showError(error.response?.data?.detail || 'Erreur lors de la suppression du rôle');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createRole,
    updateRole,
    deleteRole,
    loading,
  };
};

