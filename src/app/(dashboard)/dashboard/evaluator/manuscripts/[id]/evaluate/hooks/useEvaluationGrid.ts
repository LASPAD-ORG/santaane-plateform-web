'use client';

import { useState, useEffect, useCallback } from 'react';
import { evaluationGridService } from '@/services/evaluationGridService';
import type { EvaluationGrid, SaveEvaluationGridRequest } from '@/types/evaluationGrid';
import { useAlertStore } from '@/stores/alertStore';

interface UseEvaluationGridOptions {
  manuscriptId: number;
  articleTitle?: string;
  evaluatorName?: string;
}

export function useEvaluationGrid({
  manuscriptId,
  articleTitle = '',
  evaluatorName = ''
}: UseEvaluationGridOptions) {
  const [grid, setGrid] = useState<EvaluationGrid | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Charger la grille au montage
  const loadGrid = useCallback(async () => {
    setLoading(true);
    try {
      const existingGrid = await evaluationGridService.getEvaluationGrid(manuscriptId);
      setGrid(existingGrid);
    } catch (error: any) {
      console.error('Erreur chargement grille d\'évaluation:', error);
      useAlertStore.getState().showError('Erreur lors du chargement de la grille');
      setGrid(null);
    } finally {
      setLoading(false);
    }
  }, [manuscriptId]);

  useEffect(() => {
    loadGrid();
  }, [loadGrid]);

  // Sauvegarder la grille
  const saveGrid = useCallback(async (data: SaveEvaluationGridRequest) => {
    setSaving(true);
    try {
      const savedGrid = await evaluationGridService.saveEvaluationGrid(
        manuscriptId,
        data
      );
      setGrid(savedGrid);
      useAlertStore.getState().showSuccess('Grille d\'évaluation enregistrée');
      return savedGrid;
    } catch (error: any) {
      console.error('Erreur sauvegarde grille:', error);
      useAlertStore.getState().showError('Erreur lors de la sauvegarde de la grille');
      throw error;
    } finally {
      setSaving(false);
    }
  }, [manuscriptId]);

  return {
    grid,
    loading,
    saving,
    saveGrid,
    refetch: loadGrid,
  };
}
