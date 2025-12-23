import { useState } from 'react';
import axios from 'axios';
import { useAlertStore } from '@/stores/alertStore';

interface AssignEvaluatorRequest {
  evaluatorId: number;
  evaluationDeadline: string;
}

export function useAssignEvaluator() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const assignEvaluator = async (
    manuscriptId: number,
    data: AssignEvaluatorRequest
  ): Promise<boolean> => {
    setLoading(true);
    try {
      await axios.post(`/api/manuscripts/${manuscriptId}/assign-evaluator`, data);
      showSuccess('Évaluateur assigné avec succès. Un email de notification a été envoyé.');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'assignation de l\'évaluateur:', error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Erreur lors de l\'assignation de l\'évaluateur';
        showError(message);
      } else {
        showError('Erreur lors de l\'assignation de l\'évaluateur');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    assignEvaluator,
    loading,
  };
}
