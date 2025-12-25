/**
 * Real Evaluation Grid Service - Connects to backend via Next.js API routes
 *
 * This service calls Next.js proxy routes which forward to FastAPI backend
 * Authentication is handled via HTTP-Only cookies
 */

import { apiClient } from '@/lib/api/client';
import type { EvaluationGrid, SaveEvaluationGridRequest } from '@/types/evaluationGrid';

/**
 * Real Evaluation Grid Service
 */
export const evaluationGridService = {
  /**
   * Get evaluation grid for a manuscript
   * Returns null if no grid exists yet (404)
   */
  async getEvaluationGrid(manuscriptId: number): Promise<EvaluationGrid | null> {
    try {
      const { data } = await apiClient.get<EvaluationGrid>(
        `/manuscripts/${manuscriptId}/evaluation-grid`
      );
      return data;
    } catch (error: any) {
      // 404 means no grid exists yet - this is normal
      if (error.response?.status === 404) {
        return null;
      }
      // Other errors should be thrown
      throw error;
    }
  },

  /**
   * Save (create or update) evaluation grid
   * Backend uses UPSERT logic based on (manuscript_id, evaluator_id)
   */
  async saveEvaluationGrid(
    manuscriptId: number,
    data: SaveEvaluationGridRequest
  ): Promise<EvaluationGrid> {
    const { data: savedGrid } = await apiClient.put<EvaluationGrid>(
      `/manuscripts/${manuscriptId}/evaluation-grid`,
      data
    );
    return savedGrid;
  },

  /**
   * Submit final evaluation (marks grid as submitted)
   * This endpoint also finalizes the entire manuscript evaluation
   */
  async submitEvaluation(manuscriptId: number): Promise<{
    message: string;
    evaluationGrid: EvaluationGrid;
    annotationCount: number;
  }> {
    const { data } = await apiClient.post(
      `/manuscripts/${manuscriptId}/submit-evaluation`
    );
    return data;
  }
};
