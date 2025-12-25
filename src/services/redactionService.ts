import { apiClient } from '@/lib/api/client';
import type {
  BackendRedaction,
  CreateRedactionRequest,
  UpdateRedactionRequest,
  AnonymizationStatusRequest,
  AnonymizationStatusResponse
} from '@/types/redaction';

/**
 * Service for manuscript redactions (anonymization)
 *
 * EDITOR-only operations for anonymizing manuscripts before evaluator assignment.
 * All endpoints require EDITOR role.
 */
export const redactionService = {
  /**
   * Get all redactions for a manuscript
   *
   * @param manuscriptId - ID of the manuscript
   * @returns Array of redactions
   */
  async getRedactions(manuscriptId: number): Promise<BackendRedaction[]> {
    const { data } = await apiClient.get(`/manuscripts/${manuscriptId}/redactions`);
    return data;
  },

  /**
   * Create a new redaction zone
   *
   * @param manuscriptId - ID of the manuscript
   * @param redaction - Redaction creation request
   * @returns Created redaction
   */
  async createRedaction(
    manuscriptId: number,
    redaction: CreateRedactionRequest
  ): Promise<BackendRedaction> {
    const { data } = await apiClient.post(
      `/manuscripts/${manuscriptId}/redactions`,
      redaction
    );
    return data;
  },

  /**
   * Update an existing redaction
   *
   * @param redactionId - UUID of the redaction
   * @param update - Update request (comment only)
   * @returns Updated redaction
   */
  async updateRedaction(
    redactionId: string,
    update: UpdateRedactionRequest
  ): Promise<BackendRedaction> {
    const { data } = await apiClient.put(
      `/manuscripts/redactions/${redactionId}`,
      update
    );
    return data;
  },

  /**
   * Delete a redaction
   *
   * @param redactionId - UUID of the redaction
   */
  async deleteRedaction(redactionId: string): Promise<void> {
    await apiClient.delete(`/manuscripts/redactions/${redactionId}`);
  },

  /**
   * Mark manuscript as anonymized
   *
   * Sets is_anonymized=true, enabling evaluator assignment.
   *
   * @param manuscriptId - ID of the manuscript
   * @param request - Confirmation request (default: { confirmAnonymized: true })
   * @returns Anonymization status with redaction count
   */
  async markAsAnonymized(
    manuscriptId: number,
    request: AnonymizationStatusRequest = { confirmAnonymized: true }
  ): Promise<AnonymizationStatusResponse> {
    const { data } = await apiClient.post(
      `/manuscripts/${manuscriptId}/mark-anonymized`,
      request
    );
    return data;
  },

  /**
   * Unmark manuscript as anonymized
   *
   * Sets is_anonymized=false, useful when editor needs to add more redactions.
   *
   * @param manuscriptId - ID of the manuscript
   * @returns Anonymization status
   */
  async unmarkAsAnonymized(manuscriptId: number): Promise<AnonymizationStatusResponse> {
    const { data } = await apiClient.delete(
      `/manuscripts/${manuscriptId}/mark-anonymized`
    );
    return data;
  }
};
