'use client';

import { useState, useEffect, useCallback } from 'react';
import { editorEvaluationService } from '@/services/editorEvaluationService';
import type { EvaluationGrid } from '@/types/evaluationGrid';
import { useAlertStore } from '@/stores/alertStore';

interface UseEvaluatorGridOptions {
  manuscriptId: number;
  evaluatorId: number;
}

export function useEvaluatorGrid({
  manuscriptId,
  evaluatorId
}: UseEvaluatorGridOptions) {
  const [grid, setGrid] = useState<EvaluationGrid | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGrid = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await editorEvaluationService.getEvaluatorGrid(
        manuscriptId,
        evaluatorId
      );
      setGrid(data);
    } catch (err: any) {
      console.error('Error loading evaluation grid:', err);
      const httpStatus = err?.response?.status;
      const detail = err?.response?.data?.detail;
      if (httpStatus === 403) {
        setError(detail || "Les evaluations sont en cours de validation par l'editeur.");
      } else {
        const errorMsg = "Erreur lors du chargement de la grille d'evaluation";
        setError(errorMsg);
        useAlertStore.getState().showError(errorMsg);
      }
      setGrid(null);
    } finally {
      setLoading(false);
    }
  }, [manuscriptId, evaluatorId]);

  useEffect(() => {
    loadGrid();
  }, [loadGrid]);

  return {
    grid,
    loading,
    error,
    refetch: loadGrid,
  };
}
