import { apiClient } from '@/lib/api/client';
import type { BackendRedaction } from '@/types/redaction';

/**
 * Service for retrieving manuscript redactions for evaluators
 * 
 * This service allows evaluators to see redacted zones (as black masks)
 * without accessing the original redaction content or comments.
 * Only the position data is used to create black overlays.
 */
export const redactionViewerService = {
  /**
   * Get redacted zones for an evaluator viewing a manuscript
   * 
   * Returns only position data to create black masks - no sensitive content
   * 
   * @param manuscriptId - ID of the manuscript
   * @returns Array of redaction positions (without sensitive content)
   */
  async getRedactionMasks(manuscriptId: number): Promise<RedactionMask[]> {
    try {
      // Call backend to get redaction masks for this manuscript
      // This endpoint returns only position data for masking
      const { data } = await apiClient.get(`/manuscripts/${manuscriptId}/redaction-masks`);
      return data;
    } catch (error) {
      console.error('Error fetching redaction masks:', error);
      // Return empty array if fails - don't block evaluation
      return [];
    }
  },
};

/**
 * Redaction mask for evaluators
 * Contains only position data needed to render black overlay
 */
export interface RedactionMask {
  id: string;
  pageNumber: number;
  positionData: string; // JSON with bounding rectangles
}