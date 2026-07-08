'use client';

import { useState, useEffect, useCallback } from 'react';
import { redactionViewerService, RedactionMask } from '@/services/redactionViewerService';

interface UseRedactionMasksOptions {
  manuscriptId: number;
  enabled?: boolean; // Permet de contrôler quand charger les masques
}

export function useRedactionMasks({ manuscriptId, enabled = true }: UseRedactionMasksOptions) {
  const [masks, setMasks] = useState<RedactionMask[]>([]);
  const [loading, setLoading] = useState(false); // Commence à false

  // Charger les masques de redaction au montage
  const loadRedactionMasks = useCallback(async () => {
    console.log('Loading redaction masks for manuscript:', manuscriptId);
    setLoading(true);
    try {
      const redactionMasks = await redactionViewerService.getRedactionMasks(manuscriptId);
      console.log('Loaded redaction masks:', redactionMasks.length, 'masks found');
      setMasks(redactionMasks);
    } catch (error: any) {
      console.error('Failed to load redaction masks:', error);
      // Ne pas afficher d'erreur pour les manuscrits sans redaction
      // C'est un comportement normal
      setMasks([]);
    } finally {
      setLoading(false);
    }
  }, [manuscriptId]);

  useEffect(() => {
    // Seulement charger si enabled est true
    if (enabled) {
      loadRedactionMasks();
    }
  }, [loadRedactionMasks, enabled]);

  return {
    masks,
    loading,
    reload: loadRedactionMasks,
  };
}