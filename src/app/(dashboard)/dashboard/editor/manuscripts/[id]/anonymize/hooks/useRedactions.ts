'use client';

import { useState, useEffect, useCallback } from 'react';
import { redactionService } from '@/services/redactionService';
import {
  RedactionHighlight,
  BackendRedaction,
  highlightToBackendRedaction,
  backendRedactionToHighlight,
  AnonymizationStatusResponse,
} from '@/types/redaction';
import { useAlertStore } from '@/stores/alertStore';

interface UseRedactionsOptions {
  manuscriptId: number;
}

export function useRedactions({ manuscriptId }: UseRedactionsOptions) {
  const [redactions, setRedactions] = useState<RedactionHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [anonymizationStatus, setAnonymizationStatus] = useState<AnonymizationStatusResponse | null>(null);

  // Load redactions on mount
  const loadRedactions = useCallback(async () => {
    setLoading(true);
    try {
      const backendRedactions = await redactionService.getRedactions(manuscriptId);
      const frontendHighlights = backendRedactions.map(backendRedactionToHighlight);
      setRedactions(frontendHighlights);
    } catch (error: any) {
      console.error('Error loading redactions:', error);
      useAlertStore.getState().showError('Erreur lors du chargement des zones anonymisées');
      setRedactions([]);
    } finally {
      setLoading(false);
    }
  }, [manuscriptId]);

  useEffect(() => {
    loadRedactions();
  }, [loadRedactions]);

  // Create redaction (optimistic update)
  const createRedaction = useCallback(async (redaction: RedactionHighlight) => {
    // 1. Optimistic UI update
    setRedactions((prev) => [redaction, ...prev]);

    try {
      setSaving(true);

      // 2. Prepare backend data
      const backendData = highlightToBackendRedaction(redaction, manuscriptId);

      // 3. API call
      const createdRedaction = await redactionService.createRedaction(
        manuscriptId,
        backendData
      );

      // 4. Replace temporary ID with backend ID
      setRedactions((prev) =>
        prev.map((r) =>
          r.id === redaction.id
            ? { ...r, id: String(createdRedaction.id) }
            : r
        )
      );

      useAlertStore.getState().showSuccess('Zone anonymisée ajoutée');
    } catch (error: any) {
      console.error('Error creating redaction:', error);
      useAlertStore.getState().showError('Erreur lors de l\'ajout de la zone anonymisée');

      // Rollback on error
      setRedactions((prev) => prev.filter((r) => r.id !== redaction.id));
    } finally {
      setSaving(false);
    }
  }, [manuscriptId]);

  // Update redaction
  const updateRedaction = useCallback(async (
    redactionId: string,
    updatedComment: string
  ) => {
    // 1. Optimistic update
    const oldRedactions = redactions;
    setRedactions((prev) =>
      prev.map((r) =>
        r.id === redactionId ? { ...r, comment: updatedComment } : r
      )
    );

    try {
      setSaving(true);

      // 2. API call
      await redactionService.updateRedaction(redactionId, {
        comment: updatedComment,
      });

      useAlertStore.getState().showSuccess('Zone anonymisée modifiée');
    } catch (error: any) {
      console.error('Error updating redaction:', error);
      useAlertStore.getState().showError('Erreur lors de la modification');

      // Rollback
      setRedactions(oldRedactions);
    } finally {
      setSaving(false);
    }
  }, [redactions]);

  // Delete redaction
  const deleteRedaction = useCallback(async (redactionId: string) => {
    // 1. Optimistic update
    const oldRedactions = redactions;
    setRedactions((prev) => prev.filter((r) => r.id !== redactionId));

    try {
      setSaving(true);

      // 2. API call
      await redactionService.deleteRedaction(redactionId);

      useAlertStore.getState().showSuccess('Zone anonymisée supprimée');
    } catch (error: any) {
      console.error('Error deleting redaction:', error);
      useAlertStore.getState().showError('Erreur lors de la suppression');

      // Rollback
      setRedactions(oldRedactions);
    } finally {
      setSaving(false);
    }
  }, [redactions]);

  // Mark manuscript as anonymized
  const markAsAnonymized = useCallback(async () => {
    try {
      setSaving(true);
      const status = await redactionService.markAsAnonymized(manuscriptId);
      setAnonymizationStatus(status);
      useAlertStore.getState().showSuccess('Manuscrit marqué comme anonymisé');
      return status;
    } catch (error: any) {
      console.error('Error marking as anonymized:', error);
      useAlertStore.getState().showError('Erreur lors du marquage');
      throw error;
    } finally {
      setSaving(false);
    }
  }, [manuscriptId]);

  // Unmark manuscript as anonymized
  const unmarkAsAnonymized = useCallback(async () => {
    try {
      setSaving(true);
      const status = await redactionService.unmarkAsAnonymized(manuscriptId);
      setAnonymizationStatus(status);
      useAlertStore.getState().showSuccess('Manuscrit démarqué');
      return status;
    } catch (error: any) {
      console.error('Error unmarking:', error);
      useAlertStore.getState().showError('Erreur lors du démarquage');
      throw error;
    } finally {
      setSaving(false);
    }
  }, [manuscriptId]);

  return {
    redactions,
    loading,
    saving,
    anonymizationStatus,
    createRedaction,
    updateRedaction,
    deleteRedaction,
    markAsAnonymized,
    unmarkAsAnonymized,
    refetch: loadRedactions,
  };
}
