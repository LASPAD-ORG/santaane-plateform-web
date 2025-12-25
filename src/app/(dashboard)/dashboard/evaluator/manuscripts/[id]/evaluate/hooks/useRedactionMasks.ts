'use client';

import { useState, useEffect, useCallback } from 'react';
import { redactionViewerService, RedactionMask } from '@/services/redactionViewerService';

interface UseRedactionMasksOptions {
  manuscriptId: number;
}

export function useRedactionMasks({ manuscriptId }: UseRedactionMasksOptions) {
  const [masks, setMasks] = useState<RedactionMask[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les masques de redaction au montage
  const loadRedactionMasks = useCallback(async () => {
    setLoading(true);
    try {
      const redactionMasks = await redactionViewerService.getRedactionMasks(manuscriptId);
      setMasks(redactionMasks);
    } catch (error: any) {
      console.error('Erreur chargement masques redaction:', error);
      // Ne pas bloquer l'évaluation si les masques ne se chargent pas
      setMasks([]);
    } finally {
      setLoading(false);
    }
  }, [manuscriptId]);

  useEffect(() => {
    loadRedactionMasks();
  }, [loadRedactionMasks]);

  return {
    masks,
    loading,
    reload: loadRedactionMasks,
  };
}