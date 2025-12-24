'use client';

import { useState, useEffect, useCallback } from 'react';
import { mockAnnotationService } from '@/services/mockAnnotationService';
import {
  EvaluatorHighlight,
  BackendAnnotation,
  highlightToBackendAnnotation,
  backendAnnotationToHighlight,
} from '@/types/evaluator';
import { useAlertStore } from '@/stores/alertStore';

interface UseAnnotationsOptions {
  manuscriptId: number;
}

export function useAnnotations({ manuscriptId }: UseAnnotationsOptions) {
  const [highlights, setHighlights] = useState<EvaluatorHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Charger les annotations au montage
  const loadAnnotations = useCallback(async () => {
    setLoading(true);
    try {
      const backendAnnotations = await mockAnnotationService.getAnnotations(manuscriptId);
      const frontendHighlights = backendAnnotations.map(backendAnnotationToHighlight);
      setHighlights(frontendHighlights);
    } catch (error: any) {
      console.error('Erreur chargement annotations:', error);
      useAlertStore.getState().showError('Erreur lors du chargement des annotations');
      setHighlights([]);
    } finally {
      setLoading(false);
    }
  }, [manuscriptId]);

  useEffect(() => {
    loadAnnotations();
  }, [loadAnnotations]);

  // Créer une annotation (optimistic update)
  const createAnnotation = useCallback(async (highlight: EvaluatorHighlight) => {
    // 1. Mise à jour optimiste de l'UI
    setHighlights((prev) => [highlight, ...prev]);

    try {
      setSaving(true);

      // 2. Préparer les données backend
      const backendData = highlightToBackendAnnotation(highlight, manuscriptId);

      // 3. Appel API
      const createdAnnotation = await mockAnnotationService.createAnnotation(
        manuscriptId,
        backendData
      );

      // 4. Remplacer l'ID temporaire par l'ID backend
      setHighlights((prev) =>
        prev.map((h) =>
          h.id === highlight.id
            ? { ...h, id: String(createdAnnotation.id) }
            : h
        )
      );

      useAlertStore.getState().showSuccess('Annotation ajoutée');
    } catch (error: any) {
      console.error('Erreur création annotation:', error);
      useAlertStore.getState().showError('Erreur lors de l\'ajout de l\'annotation');

      // Rollback en cas d'erreur
      setHighlights((prev) => prev.filter((h) => h.id !== highlight.id));
    } finally {
      setSaving(false);
    }
  }, [manuscriptId]);

  // Modifier une annotation
  const updateAnnotation = useCallback(async (
    annotationId: string,
    updatedComment: string
  ) => {
    // 1. Mise à jour optimiste
    const oldHighlights = highlights;
    setHighlights((prev) =>
      prev.map((h) =>
        h.id === annotationId ? { ...h, comment: updatedComment } : h
      )
    );

    try {
      setSaving(true);

      // 2. Appel API
      await mockAnnotationService.updateAnnotation(annotationId, {
        comment: updatedComment,
      });

      useAlertStore.getState().showSuccess('Annotation modifiée');
    } catch (error: any) {
      console.error('Erreur modification annotation:', error);
      useAlertStore.getState().showError('Erreur lors de la modification');

      // Rollback
      setHighlights(oldHighlights);
    } finally {
      setSaving(false);
    }
  }, [highlights]);

  // Supprimer une annotation
  const deleteAnnotation = useCallback(async (annotationId: string) => {
    // 1. Mise à jour optimiste
    const oldHighlights = highlights;
    setHighlights((prev) => prev.filter((h) => h.id !== annotationId));

    try {
      setSaving(true);

      // 2. Appel API
      await mockAnnotationService.deleteAnnotation(annotationId);

      useAlertStore.getState().showSuccess('Annotation supprimée');
    } catch (error: any) {
      console.error('Erreur suppression annotation:', error);
      useAlertStore.getState().showError('Erreur lors de la suppression');

      // Rollback
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
