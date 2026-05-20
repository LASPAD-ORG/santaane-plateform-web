import type { BackendRedaction } from '@/types/redaction';

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export const redactionViewerService = {
  async getRedactionMasks(manuscriptId: number): Promise<RedactionMask[]> {
    try {
      const response = await fetch(`/api/v1/manuscripts/${manuscriptId}/redaction-masks`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error('Error fetching redaction masks:', response.status);
        return [];
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching redaction masks:', {
        manuscriptId,
        message: error.message
      });
      return [];
    }
  },
};

export interface RedactionMask {
  id: string;
  pageNumber: number;
  positionData: string;
}