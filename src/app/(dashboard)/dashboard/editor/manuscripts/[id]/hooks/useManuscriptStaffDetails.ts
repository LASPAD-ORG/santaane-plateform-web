import { useState, useEffect } from 'react';
import axios from 'axios';
import { ManuscriptDetail } from '@/types/manuscriptDetail';

export function useManuscriptStaffDetails(manuscriptId: string) {
  const [manuscript, setManuscript] = useState<ManuscriptDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchManuscriptDetails = async () => {
    setLoading(true);
    try {
      // ✅ FIX: URL via proxy Next.js rewrites (évite mixed content HTTP/HTTPS)

      const response = await fetch(`/api/manuscripts/detail/${manuscriptId}`);


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
