'use client';

import { useState } from 'react';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useAlertStore } from '@/stores/alertStore';

interface ValidateForExternalButtonProps {
  manuscriptId: number;
  gridSubmitted: boolean;
  alreadyValidated?: boolean;
  onValidated?: () => void;
}

export default function ValidateForExternalButton({
  manuscriptId,
  gridSubmitted,
  alreadyValidated = false,
  onValidated,
}: ValidateForExternalButtonProps) {
  const [loading, setLoading] = useState(false);
  const showSuccess = useAlertStore((s) => s.showSuccess);
  const showError = useAlertStore((s) => s.showError);

  const handleValidate = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/manuscripts/${manuscriptId}/internal-validation`,
        { method: 'POST' }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || data?.message || 'Validation impossible');
      }
      showSuccess(
        'Manuscrit validé. Les évaluateurs externes peuvent maintenant être assignés.'
      );
      onValidated?.();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  if (alreadyValidated) {
    return (
      <Button variant="outlined" color="success" startIcon={<CheckCircleIcon />} disabled>
        Validé pour évaluation externe
      </Button>
    );
  }

  const button = (
    <span>
      <Button
        variant="contained"
        color="success"
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
        onClick={handleValidate}
        disabled={loading || !gridSubmitted}
      >
        Valider pour évaluation externe
      </Button>
    </span>
  );

  return gridSubmitted ? (
    button
  ) : (
    <Tooltip title="Soumettez d'abord votre grille d'évaluation">{button}</Tooltip>
  );
}