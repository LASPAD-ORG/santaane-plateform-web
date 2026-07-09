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
      // Suppress console logging for handled errors
      if (axios.isAxiosError(error)) {
        // Extract error message from backend response
        const errorData = error.response?.data;
        let message = 'Erreur lors de l\'assignation de l\'évaluateur';
        
        if (errorData) {
          // Try different possible fields where the error message might be
          message = errorData.detail || 
                   errorData.message || 
                   errorData.error || 
                   errorData.errorCode ||  // Backend uses this field!
                   (typeof errorData === 'string' ? errorData : message);
        }

        // Check if it's the anonymization error and provide a helpful message
        if (typeof message === 'string' && (
            message.toLowerCase().includes('must be anonymized') ||
            message.toLowerCase().includes('anonymized first') ||
            message.includes('Cannot assign evaluator: manuscript must be anonymized first')
          )) {
          showError('Le manuscrit doit d\'abord être anonymisé avant d\'assigner un évaluateur.\n\nUtilisez le bouton "Anonymiser" pour masquer les informations sensibles.');
        } else {
          showError(typeof message === 'string' ? message : 'Erreur lors de l\'assignation de l\'évaluateur');
        }
      } else {
        console.error('Erreur lors de l\'assignation de l\'évaluateur:', error);
        showError('Erreur lors de l\'assignation de l\'évaluateur');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const assignInternalEvaluator = async (
    manuscriptId: number,
    data: AssignEvaluatorRequest
  ): Promise<boolean> => {
    setLoading(true);
    try {
      await axios.post(`/api/manuscripts/${manuscriptId}/assign-internal-evaluator`, data);
      showSuccess('Évaluateur interne assigné avec succès. Un email de notification a été envoyé.');
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        let message = "Erreur lors de l'assignation de l'évaluateur interne";
        if (errorData) {
          message = errorData.detail || errorData.message || errorData.error || errorData.errorCode ||
                    (typeof errorData === 'string' ? errorData : message);
        }
        if (typeof message === 'string' && (
            message.toLowerCase().includes('must be anonymized') ||
            message.toLowerCase().includes('anonymized first')
          )) {
          showError("Le manuscrit doit d'abord être anonymisé avant d'assigner un évaluateur interne.");
        } else {
          showError(typeof message === 'string' ? message : "Erreur lors de l'assignation de l'évaluateur interne");
        }
      } else {
        showError("Erreur lors de l'assignation de l'évaluateur interne");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    assignEvaluator,
    assignInternalEvaluator,
    loading,
  };
}
