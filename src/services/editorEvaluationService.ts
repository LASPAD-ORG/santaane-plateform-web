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
};
