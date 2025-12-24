import { apiClient } from '@/lib/api/client';
import type {
  BackendAnnotation,
  CreateAnnotationRequest,
  UpdateAnnotationRequest
} from '@/types/evaluator';

/**
 * Service for manuscript annotations
 *
 * Connects to the real backend APIs via Next.js API routes proxy
 */
export const annotationService = {
  /**
   * Get all annotations for a manuscript
   */
  async getAnnotations(manuscriptId: number): Promise<BackendAnnotation[]> {
    const { data } = await apiClient.get(`/manuscripts/${manuscriptId}/annotations`);
    return data;
  },

  /**
   * Create a new annotation
   */
  async createAnnotation(
    manuscriptId: number,
    annotation: CreateAnnotationRequest
  ): Promise<BackendAnnotation> {
    const { data } = await apiClient.post(
      `/manuscripts/${manuscriptId}/annotations`,
      annotation
    );
    return data;
  },

  /**
   * Update an existing annotation
   */
  async updateAnnotation(
    annotationId: string,
    update: UpdateAnnotationRequest
  ): Promise<BackendAnnotation> {
    const { data } = await apiClient.put(
      `/manuscripts/annotations/${annotationId}`,
      update
    );
    return data;
  },

  /**
   * Delete an annotation
   */
  async deleteAnnotation(annotationId: string): Promise<void> {
    await apiClient.delete(`/manuscripts/annotations/${annotationId}`);
  }
};
