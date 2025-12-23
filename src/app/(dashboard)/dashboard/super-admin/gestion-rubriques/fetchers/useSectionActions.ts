'use client';

import { useState } from 'react';
import apiClient from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';
import type { Section } from './useFetchSections';

export interface CreateSectionData {
  name: string;
  signe_min: number;
  signe_max: number;
}

export interface UpdateSectionData {
  name?: string;
  signe_min?: number;
  signe_max?: number;
}

export const useSectionActions = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const createSection = async (data: CreateSectionData) => {
    setLoading(true);
    try {
      const response = await apiClient.post<Section>('/sections/', data);
      showSuccess('Rubrique créée avec succès');
      return response.data;
    } catch (error: any) {
      showError(error.response?.data?.detail || 'Erreur lors de la création de la rubrique');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (id: number, data: UpdateSectionData) => {
    setLoading(true);
    try {
      const response = await apiClient.put<Section>(`/sections/${id}`, data);
      showSuccess('Rubrique mise à jour avec succès');
      return response.data;
    } catch (error: any) {
      showError(error.response?.data?.detail || 'Erreur lors de la mise à jour de la rubrique');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteSection = async (id: number) => {
    setLoading(true);
    try {
      await apiClient.delete(`/sections/${id}`);
      showSuccess('Rubrique supprimée avec succès');
    } catch (error: any) {
      showError(error.response?.data?.detail || 'Erreur lors de la suppression de la rubrique');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSection,
    updateSection,
    deleteSection,
    loading,
  };
};

