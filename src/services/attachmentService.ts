import { apiClient } from '@/lib/api/client';
import type { Attachment, AttachmentRequest } from '@/types/attachment';

/**
 * Service for manuscript attachments and attachment requests.
 */
export const attachmentService = {
  async list(manuscriptId: number): Promise<Attachment[]> {
    const { data } = await apiClient.get(`/manuscripts/${manuscriptId}/attachments`);
    return data;
  },

  async upload(
    manuscriptId: number,
    payload: {
      file: File;
      title: string;
      description?: string;
      visibleToAuthor?: boolean;
      requestId?: number;
    }
  ): Promise<Attachment> {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('title', payload.title);
    if (payload.description) formData.append('description', payload.description);
    if (payload.visibleToAuthor !== undefined) {
      formData.append('visible_to_author', String(payload.visibleToAuthor));
    }
    if (payload.requestId !== undefined) {
      formData.append('request_id', String(payload.requestId));
    }
    const { data } = await apiClient.post(
      `/manuscripts/${manuscriptId}/attachments`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },

  async download(manuscriptId: number, attachmentId: number, filename: string): Promise<void> {
    const response = await apiClient.get(
      `/manuscripts/${manuscriptId}/attachments/${attachmentId}/download`,
      { responseType: 'blob' }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async remove(manuscriptId: number, attachmentId: number): Promise<void> {
    await apiClient.delete(`/manuscripts/${manuscriptId}/attachments/${attachmentId}`);
  },

  async listRequests(manuscriptId: number): Promise<AttachmentRequest[]> {
    const { data } = await apiClient.get(`/manuscripts/${manuscriptId}/attachment-requests`);
    return data;
  },

  async createRequest(
    manuscriptId: number,
    payload: { title: string; description?: string }
  ): Promise<AttachmentRequest> {
    const { data } = await apiClient.post(
      `/manuscripts/${manuscriptId}/attachment-requests`,
      { title: payload.title, description: payload.description ?? null }
    );
    return data;
  },
};