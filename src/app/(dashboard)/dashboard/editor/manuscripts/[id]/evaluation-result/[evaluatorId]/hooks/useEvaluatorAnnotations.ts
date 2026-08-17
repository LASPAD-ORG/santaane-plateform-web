'use client';

import { useState, useEffect, useCallback } from 'react';
import { editorEvaluationService } from '@/services/editorEvaluationService';
import { backendAnnotationToHighlight } from '@/types/evaluator';
import type { EvaluatorHighlight } from '@/types/evaluator';
import { useAlertStore } from '@/stores/alertStore';

interface UseEvaluatorAnnotationsOptions {
  manuscriptId: number;
  evaluatorId: number;
}

export function useEvaluatorAnnotations({
  manuscriptId,
  evaluatorId
}: UseEvaluatorAnnotationsOptions) {
  const [annotations, setAnnotations] = useState<EvaluatorHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnnotations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const backendAnnotations = await editorEvaluationService.getEvaluatorAnnotations(
        manuscriptId,
        evaluatorId
      );
      const frontendHighlights = backendAnnotations.map(backendAnnotationToHighlight);
      setAnnotations(frontendHighlights);
    } catch (err: any) {
      console.error('Error loading evaluator annotations:', err);
      const httpStatus = err?.response?.status;
      const detail = err?.response?.data?.detail;
      if (httpStatus === 403) {
        setError(detail || "Les evaluations sont en cours de validation par l'editeur.");
      } else {
        const errorMsg = 'Erreur lors du chargement des annotations';
        setError(errorMsg);
        useAlertStore.getState().showError(errorMsg);
      }
      setAnnotations([]);
    } finally {
      setLoading(false);
    }
  }, [manuscriptId, evaluatorId]);

  useEffect(() => {
    loadAnnotations();
  }, [loadAnnotations]);

  return {
    annotations,
    loading,
    error,
    refetch: loadAnnotations,
  };
}
