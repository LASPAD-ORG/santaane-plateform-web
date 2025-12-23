import { useState, useEffect } from 'react';
import axios from 'axios';
import { EvaluatorListResponse } from '@/types/evaluator';

export function useEvaluators(page: number = 1, size: number = 20) {
  const [data, setData] = useState<EvaluatorListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluators = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/evaluators?page=${page}&size=${size}`);
      setData(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des évaluateurs:', err);
      setError('Erreur lors de la récupération des évaluateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  return {
    evaluators: data?.items || [],
    total: data?.total || 0,
    hasMore: data?.has_more || false,
    loading,
    error,
    refetch: fetchEvaluators,
  };
}
