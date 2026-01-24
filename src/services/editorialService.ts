import { apiClient } from '@/lib/api/client';
import { EditorialVersion } from '@/types/manuscript';

export const editorialService = {
  // Récupérer l'historique des versions
  async getVersions(manuscriptId: number): Promise<EditorialVersion[]> {
    const { data } = await apiClient.get(`/manuscripts/${manuscriptId}/editorial/versions`);
    return data;
  },

  // Uploader une nouvelle version modifiée par l'éditeur
  async uploadVersion(manuscriptId: number, file: File): Promise<EditorialVersion> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post(
      `/manuscripts/${manuscriptId}/editorial/upload`, 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  }
};