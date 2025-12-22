import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAlertStore } from '@/stores/alertStore';
import type { ManuscriptsResponse } from '@/types/manuscript';

export function useManuscripts() {
  const { showError } = useAlertStore();
  const [loading, setLoading] = useState(true);
  const [manuscripts, setManuscripts] = useState<ManuscriptsResponse['manuscripts']>([]);
  const [total, setTotal] = useState(0);

  const fetchManuscripts = async (skip = 0, limit = 100) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/manuscripts/my-manuscripts', {
        params: { skip, limit },
      });

      setManuscripts(response.data.manuscripts);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching manuscripts:', error);
      showError('Erreur lors du chargement des manuscrits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManuscripts();
  }, []);

  return { loading, manuscripts, total, refetch: fetchManuscripts };
}
