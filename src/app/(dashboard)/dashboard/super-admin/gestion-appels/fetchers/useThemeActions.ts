'use client';

import { useState } from 'react';
import apiClient from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';
import type { Theme } from './useFetchThemes';

export interface CreateThemeData {
  title: string;
  description: string;
  date_limite: string;
}

export interface UpdateThemeData {
  title?: string;
  description?: string;
  date_limite?: string;
}

export const useThemeActions = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const createTheme = async (data: CreateThemeData) => {
    setLoading(true);
    try {
      const response = await apiClient.post<Theme>('/themes/', data);
      showSuccess('Appel créé avec succès');
      return response.data;
    } catch (error: any) {
      showError(error.response?.data?.detail || 'Erreur lors de la création de l\'appel');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = async (id: number, data: UpdateThemeData) => {
    setLoading(true);
    try {
      const response = await apiClient.put<Theme>(`/themes/${id}`, data);
      showSuccess('Appel mis à jour avec succès');
      return response.data;
    } catch (error: any) {
      showError(error.response?.data?.detail || 'Erreur lors de la mise à jour de l\'appel');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTheme = async (id: number) => {
    setLoading(true);
    try {
      await apiClient.delete(`/themes/${id}`);
      showSuccess('Appel supprimé avec succès');
    } catch (error: any) {
      showError(error.response?.data?.detail || 'Erreur lors de la suppression de l\'appel');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTheme,
    updateTheme,
    deleteTheme,
    loading,
  };
};

