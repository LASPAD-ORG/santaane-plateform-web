import { useState, useEffect } from 'react';
import axios from 'axios';
import { EvaluatorManuscript, AssignmentStatus } from '@/types/evaluator';
import { useAlertStore } from '@/stores/alertStore';

export function useEvaluatorManuscripts() {
  const [manuscripts, setManuscripts] = useState<EvaluatorManuscript[]>([]);
  const [filteredManuscripts, setFilteredManuscripts] = useState<EvaluatorManuscript[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | 'all'>('all');
  const { showError } = useAlertStore();

  const fetchManuscripts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/evaluator/manuscripts');
      setManuscripts(response.data);
      setFilteredManuscripts(response.data);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des manuscrits:', error);
      
      if (error.response?.status === 401) {
        showError('Session expirée. Veuillez vous reconnecter.');
      } else if (error.response?.status === 403) {
        showError('Accès refusé. Vous devez avoir le rôle évaluateur.');
      } else {
        showError('Erreur lors de la récupération des manuscrits');
      }
      
      setManuscripts([]);
      setFilteredManuscripts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManuscripts();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredManuscripts(manuscripts);
    } else {
      setFilteredManuscripts(
        manuscripts.filter((m) => m.assignmentStatus === statusFilter)
      );
    }
  }, [statusFilter, manuscripts]);

  const handleStatusFilterChange = (status: AssignmentStatus | 'all') => {
    setStatusFilter(status);
  };

  return {
    manuscripts: filteredManuscripts,
    total: filteredManuscripts.length,
    loading,
    statusFilter,
    handleStatusFilterChange,
    refetch: fetchManuscripts,
  };
}
