import { useState, useEffect } from 'react';
import axios from 'axios';
import { ManuscriptDetail } from '@/types/manuscriptDetail';

export function useManuscriptStaffDetails(manuscriptId: string) {
  const [manuscript, setManuscript] = useState<ManuscriptDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchManuscriptDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/manuscripts/detail/${manuscriptId}`);
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
