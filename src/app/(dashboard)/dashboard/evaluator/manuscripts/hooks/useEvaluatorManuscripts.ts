import { useState, useEffect } from 'react';
import axios from 'axios';
import { EvaluatorManuscript, AssignmentStatus, EvaluationStatus } from '@/types/evaluator';
import { useAlertStore } from '@/stores/alertStore';

export function useEvaluatorManuscripts() {
  const [manuscripts, setManuscripts] = useState<EvaluatorManuscript[]>([]);
  const [filteredManuscripts, setFilteredManuscripts] = useState<EvaluatorManuscript[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | EvaluationStatus | 'all'>('all');
  const { showError } = useAlertStore();

  const fetchManuscripts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/evaluator/manuscripts');
      console.log('Manuscrits reçus:', response.data);
      // Afficher le détail de chaque manuscrit pour débugger
      response.data.forEach((m: any, index: number) => {
        console.log(`Manuscrit ${index}:`, {
          id: m.id,
          title: m.title,
          assignmentStatus: m.assignmentStatus,
          evaluationStatus: m.evaluationStatus
        });
      });
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
    console.log('Filtrage avec statusFilter:', statusFilter);
    console.log('Nombre total de manuscrits:', manuscripts.length);
    
    if (statusFilter === 'all') {
      setFilteredManuscripts(manuscripts);
    } else if (statusFilter === 'pending' || statusFilter === 'accepted' || statusFilter === 'declined') {
      // Filtre par statut d'assignation
      const filtered = manuscripts.filter((m) => m.assignmentStatus === statusFilter);
      console.log(`Manuscrits avec assignmentStatus=${statusFilter}:`, filtered.length);
      setFilteredManuscripts(filtered);
    } else if (statusFilter === 'in_progress') {
      // En cours : acceptés et avec evaluationStatus in_progress (qui inclut maintenant not_started)
      const filtered = manuscripts.filter((m) => {
        const isAccepted = m.assignmentStatus === 'accepted';
        const isInProgress = m.evaluationStatus === 'in_progress';
        console.log(`Manuscrit ${m.id}: accepted=${isAccepted}, evaluationStatus=${m.evaluationStatus}, inProgress=${isInProgress}`);
        return isAccepted && isInProgress;
      });
      console.log('Manuscrits en cours d\'évaluation:', filtered.length);
      setFilteredManuscripts(filtered);
    } else if (statusFilter === 'completed') {
      // Terminés : acceptés et avec evaluationStatus completed
      const filtered = manuscripts.filter((m) => 
        m.assignmentStatus === 'accepted' && 
        m.evaluationStatus === 'completed'
      );
      console.log('Manuscrits terminés:', filtered.length);
      setFilteredManuscripts(filtered);
    } else {
      // Autres cas de evaluationStatus
      const filtered = manuscripts.filter((m) => m.evaluationStatus === statusFilter);
      console.log(`Manuscrits avec evaluationStatus=${statusFilter}:`, filtered.length);
      setFilteredManuscripts(filtered);
    }
  }, [statusFilter, manuscripts]);

  const handleStatusFilterChange = (status: AssignmentStatus | EvaluationStatus | 'all') => {
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
