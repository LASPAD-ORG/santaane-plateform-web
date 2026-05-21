import { apiClient } from '@/lib/api/client';
import type {
  BackendAnnotation,
  CreateAnnotationRequest,
  UpdateAnnotationRequest
} from '@/types/evaluator';

export const annotationService = {
  async getAnnotations(manuscriptId: number, evaluatorId?: number): Promise<BackendAnnotation[]> {
    const { data } = await apiClient.get(`/manuscripts/${manuscriptId}/annotations`);
    return data;
  },

  async createAnnotation(manuscriptId: number, annotation: CreateAnnotationRequest): Promise<BackendAnnotation> {
    const { data } = await apiClient.post(`/manuscripts/${manuscriptId}/annotations`, annotation);
    return data;
  },

  async updateAnnotation(annotationId: string, update: UpdateAnnotationRequest): Promise<BackendAnnotation> {
    const { data } = await apiClient.put(`/manuscripts/annotations/${annotationId}`, update);
    return data;
  },

  async deleteAnnotation(annotationId: string): Promise<void> {
    await apiClient.delete(`/manuscripts/annotations/${annotationId}`);
  }
};