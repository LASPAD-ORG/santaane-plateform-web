'use client';

import { useState } from 'react';
import {
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { editorEvaluationService } from '@/services/editorEvaluationService';
import { useAlertStore } from '@/stores/alertStore';

interface ValidateEvaluationsButtonProps {
  manuscriptId: number;
  alreadyValidated?: boolean;
  validatedAt?: string | null;
  onValidated?: () => void;
}

export default function ValidateEvaluationsButton({
  manuscriptId,
  alreadyValidated = false,
  validatedAt,
  onValidated,
}: ValidateEvaluationsButtonProps) {
  const { showSuccess, showError } = useAlertStore();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDate = (d?: string | null) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const handleValidate = async () => {
    setLoading(true);
    try {
      await editorEvaluationService.validateEvaluations(manuscriptId, message.trim() || undefined);
      showSuccess('Évaluations validées et transmises à l\'auteur.');
      setOpen(false);
      setMessage('');
      onValidated?.();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Erreur lors de la validation';
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (alreadyValidated) {
    return (
      <Chip
        color="success"
        icon={<CheckCircle />}
        label={validatedAt ? `Transmis à l'auteur le ${formatDate(validatedAt)}` : 'Transmis à l\'auteur'}
        variant="outlined"
      />
    );
  }

  return (
    <>
      <Button variant="contained" color="success" startIcon={<CheckCircle />} onClick={() => setOpen(true)}>
        Valider et transmettre à l&apos;auteur
      </Button>

      <Dialog open={open} onClose={() => !loading && setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Valider les évaluations</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Les évaluations de ce manuscrit deviendront visibles par l&apos;auteur. Vous pouvez ajouter
            un message d&apos;accompagnement (facultatif) qui lui sera transmis.
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Message d'accompagnement (facultatif)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            Annuler
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleValidate}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} /> : <CheckCircle />}
          >
            Valider et transmettre
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}