import { apiClient } from '@/lib/api/client';
import type { ManuscriptVersion, ArchivedGrid, ArchivedAnnotation } from '@/types/version';

/**
 * Service for manuscript version history + evaluation cycle.
 */
export const versionService = {
  async listVersions(manuscriptId: number): Promise<ManuscriptVersion[]> {
    const { data } = await apiClient.get(`/manuscripts/${manuscriptId}/versions`);
    return data;
  },

  async getVersionGrids(manuscriptId: number, versionId: number): Promise<ArchivedGrid[]> {
    const { data } = await apiClient.get(
      `/manuscripts/${manuscriptId}/versions/${versionId}/grids`
    );
    return data;
  },

  async getVersionAnnotations(manuscriptId: number, versionId: number): Promise<ArchivedAnnotation[]> {
    const { data } = await apiClient.get(
      `/manuscripts/${manuscriptId}/versions/${versionId}/annotations`
    );
    return data;
  },

  async startEvaluationCycle(manuscriptId: number): Promise<{ success: boolean; status: string }> {
    const { data } = await apiClient.post(
      `/manuscripts/${manuscriptId}/start-evaluation-cycle`
    );
    return data;
  },
};