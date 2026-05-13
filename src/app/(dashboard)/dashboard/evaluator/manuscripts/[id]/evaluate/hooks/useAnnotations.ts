'use client';

import { useState, useEffect, useCallback } from 'react';
import { annotationService } from '@/services/annotationService';
import {
  EvaluatorHighlight,
  BackendAnnotation,
  highlightToBackendAnnotation,
  backendAnnotationToHighlight,
} from '@/types/evaluator';
import { useAlertStore } from '@/stores/alertStore';

interface UseAnnotationsOptions {
  manuscriptId: number;
  evaluatorId?: number;
}

export function useAnnotations({ manuscriptId, evaluatorId }: UseAnnotationsOptions) {
  const [highlights, setHighlights] = useState<EvaluatorHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAnnotations = useCallback(async () => {
    // ✅ FIX : ne pas charger si evaluatorId n'est pas encore disponible
    if (!evaluatorId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const backendAnnotations = await annotationService.getAnnotations(manuscriptId, evaluatorId);
      const frontendHighlights = backendAnnotations.map(backendAnnotationToHighlight);
      setHighlights(frontendHighlights);
    } catch (error: any) {
      console.error('Erreur chargement annotations:', error);
      useAlertStore.getState().showError('Erreur lors du chargement des annotations');
      setHighlights([]);
    } finally {
      setLoading(false);
    }
  }, [manuscriptId, evaluatorId]);

  useEffect(() => {
    loadAnnotations();
  }, [loadAnnotations]);

  const createAnnotation = useCallback(async (highlight: EvaluatorHighlight) => {
    setHighlights((prev) => [highlight, ...prev]);
    try {
      setSaving(true);
      const backendData = highlightToBackendAnnotation(highlight, manuscriptId);
      const createdAnnotation = await annotationService.createAnnotation(manuscriptId, backendData);
      setHighlights((prev) =>
        prev.map((h) =>
          h.id === highlight.id ? { ...h, id: String(createdAnnotation.id) } : h
        )
      );
      useAlertStore.getState().showSuccess('Annotation ajoutée');
    } catch (error: any) {
      console.error('Erreur création annotation:', error);
      useAlertStore.getState().showError('Erreur lors de l\'ajout de l\'annotation');
      setHighlights((prev) => prev.filter((h) => h.id !== highlight.id));
    } finally {
      setSaving(false);
    }
  }, [manuscriptId, evaluatorId]);

  const updateAnnotation = useCallback(async (
    annotationId: string,
    updatedComment: string
  ) => {
    const oldHighlights = highlights;
    setHighlights((prev) =>
      prev.map((h) =>
        h.id === annotationId ? { ...h, comment: updatedComment } : h
      )
    );
    try {
      setSaving(true);
      await annotationService.updateAnnotation(annotationId, { comment: updatedComment });
      useAlertStore.getState().showSuccess('Annotation modifiée');
    } catch (error: any) {
      console.error('Erreur modification annotation:', error);
      useAlertStore.getState().showError('Erreur lors de la modification');
      setHighlights(oldHighlights);
    } finally {
      setSaving(false);
    }
  }, [highlights]);

  const deleteAnnotation = useCallback(async (annotationId: string) => {
    const oldHighlights = highlights;
    setHighlights((prev) => prev.filter((h) => h.id !== annotationId));
    try {
      setSaving(true);
      await annotationService.deleteAnnotation(annotationId);
      useAlertStore.getState().showSuccess('Annotation supprimée');
    } catch (error: any) {
      console.error('Erreur suppression annotation:', error);
      useAlertStore.getState().showError('Erreur lors de la suppression');
      setHighlights(oldHighlights);
    } finally {
      setSaving(false);
    }
  }, [highlights]);

  return {
    highlights,
    loading,
    saving,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
    refetch: loadAnnotations,
  };
}