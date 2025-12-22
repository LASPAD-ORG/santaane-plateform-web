import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAlertStore } from '@/stores/alertStore';
import type { Manuscript } from '@/types/manuscript';

export function useManuscriptDetails(id: string) {
  const { showError } = useAlertStore();
  const [loading, setLoading] = useState(true);
  const [manuscript, setManuscript] = useState<Manuscript | null>(null);

  const fetchManuscript = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/manuscripts/${id}`);
      setManuscript(response.data);
    } catch (error) {
      console.error('Error fetching manuscript:', error);
      showError('Erreur lors du chargement du manuscrit');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchManuscript();
    }
  }, [id]);

  return { loading, manuscript, refetch: fetchManuscript };
}
