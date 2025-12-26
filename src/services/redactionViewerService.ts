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
      // Call backend via Next.js API route to get redaction masks for this manuscript
      // This endpoint returns only position data for masking
      const { data } = await apiClient.get(`/v1/manuscripts/${manuscriptId}/redaction-masks`);
      return data;
    } catch (error: any) {
      // Log more details about the error to help debug
      console.error('Error fetching redaction masks:', {
        manuscriptId,
        status: error?.response?.status,
        message: error?.response?.data?.detail || error.message
      });
      
      // Return empty array if endpoint doesn't exist or access denied
      // This is expected behavior - not all manuscripts have redactions
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