import { apiClient } from '@/lib/api/client';
import type { BackendAnnotation } from '@/types/evaluator';
import type { EvaluationGrid } from '@/types/evaluationGrid';

/**
 * Service for editor access to evaluator results
 */
export const editorEvaluationService = {
  /**
   * Get all annotations for a specific evaluator (editor view)
   */
  async getEvaluatorAnnotations(
    manuscriptId: number,
    evaluatorId: number
  ): Promise<BackendAnnotation[]> {
    const { data } = await apiClient.get(
      `/manuscripts/${manuscriptId}/evaluator/${evaluatorId}/annotations`
    );
    return data;
  },

  /**
   * Get evaluation grid for a specific evaluator (editor view)
   */
  async getEvaluatorGrid(
    manuscriptId: number,
    evaluatorId: number
  ): Promise<EvaluationGrid> {
    const { data } = await apiClient.get(
      `/manuscripts/${manuscriptId}/evaluator/${evaluatorId}/evaluation-grid`
    );
    return data;
  },

  /**
   * Editor updates an evaluator's grid (even if already submitted)
   */
  async editorUpdateGrid(
    manuscriptId: number,
    evaluatorId: number,
    payload: Record<string, unknown>
  ): Promise<EvaluationGrid> {
    const { data } = await apiClient.put(
      `/manuscripts/${manuscriptId}/evaluator/${evaluatorId}/evaluation-grid`,
      payload
    );
    return data;
  },

  /**
   * Editor validates all evaluations of a manuscript (make them visible to the author)
   */
  async validateEvaluations(
    manuscriptId: number,
    editorMessage?: string
  ): Promise<{ manuscriptId: number; validated: boolean; validatedAt: string; message: string }> {
    const { data } = await apiClient.post(
      `/manuscripts/${manuscriptId}/validate-evaluations`,
      { editorMessage: editorMessage ?? null }
    );
    return data;
  },
};