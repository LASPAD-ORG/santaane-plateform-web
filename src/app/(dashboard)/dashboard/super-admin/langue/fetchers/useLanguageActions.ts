'use client';

import { useState } from 'react';
import apiClient from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';
import type { Language } from './useFetchLanguages';

export interface CreateLanguageData {
  name: string;
  code: string;
}

export interface UpdateLanguageData {
  name?: string;
  code?: string;
}

export const useLanguageActions = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const createLanguage = async (data: CreateLanguageData) => {
    setLoading(true);
    try {
      const response = await apiClient.post<Language>('/languages/', data);
      showSuccess('Langue créée avec succès');
      return response.data;
    } catch (error: any) {
      showError(error.response?.data?.detail || 'Erreur lors de la création de la langue');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateLanguage = async (id: number, data: UpdateLanguageData) => {
    setLoading(true);
    try {
      const response = await apiClient.put<Language>(`/languages/${id}`, data);
      showSuccess('Langue mise à jour avec succès');
      return response.data;
    } catch (error: any) {
      showError(error.response?.data?.detail || 'Erreur lors de la mise à jour de la langue');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteLanguage = async (id: number) => {
    setLoading(true);
    try {
      await apiClient.delete(`/languages/${id}`);
      showSuccess('Langue supprimée avec succès');
    } catch (error: any) {
      showError(error.response?.data?.detail || 'Erreur lors de la suppression de la langue');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createLanguage,
    updateLanguage,
    deleteLanguage,
    loading,
  };
};

