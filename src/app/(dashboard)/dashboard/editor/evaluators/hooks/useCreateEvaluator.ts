import { useState } from 'react';
import axios from 'axios';
import { useAlertStore } from '@/stores/alertStore';
import { CreateEvaluatorRequest, Evaluator } from '@/types/evaluator';

export function useCreateEvaluator() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  const createEvaluator = async (data: CreateEvaluatorRequest): Promise<Evaluator | null> => {
    setLoading(true);
    try {
      const response = await axios.post('/api/evaluators', data);
      showSuccess('Évaluateur créé avec succès. Un email avec les identifiants a été envoyé.');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'évaluateur:', error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.detail || error.response?.data?.message || 'Erreur lors de la création de l\'évaluateur';
        showError(message);
      } else {
        showError('Erreur lors de la création de l\'évaluateur');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvaluator,
    loading,
  };
}
