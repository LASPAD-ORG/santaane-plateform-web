import { useState, useEffect } from 'react';
import { ManuscriptDetail } from '@/types/manuscriptDetail';
import { apiClient } from '@/lib/api/client';

export function useManuscriptStaffDetails(manuscriptId: string) {
  const [manuscript, setManuscript] = useState<ManuscriptDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchManuscriptDetails = async () => {
    setLoading(true);
    try {
      // ✅ FIX: apiClient a withCredentials:true — envoie le cookie auth_token
      const response = await apiClient.get(`/manuscripts/detail/${manuscriptId}`);
      setManuscript(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      setManuscript(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (manuscriptId) {
      fetchManuscriptDetails();
    }
  }, [manuscriptId]);

  return { loading, manuscript, refetch: fetchManuscriptDetails };
}
