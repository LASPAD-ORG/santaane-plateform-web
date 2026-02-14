import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useAssignEvaluator } from '../hooks/useAssignEvaluator';
import { useEvaluators } from '../../evaluators/hooks/useEvaluators';

interface AssignEvaluatorDialogProps {
  open: boolean;
  onClose: () => void;
  manuscriptId: number;
  manuscriptTitle: string;
  onSuccess?: () => void;
}

export default function AssignEvaluatorDialog({
  open,
  onClose,
  manuscriptId,
  manuscriptTitle,
  onSuccess,
}: AssignEvaluatorDialogProps) {
  const { assignEvaluator, loading: assigning } = useAssignEvaluator();
  const { evaluators, loading: loadingEvaluators } = useEvaluators(1, 100);
  
  const [evaluatorId, setEvaluatorId] = useState<number | ''>('');
  const [deadline, setDeadline] = useState('');

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setEvaluatorId('');
      // Set default deadline to 30 days from now
      const defaultDeadline = new Date();
      defaultDeadline.setDate(defaultDeadline.getDate() + 30);
      setDeadline(defaultDeadline.toISOString().slice(0, 16));
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!evaluatorId || !deadline) {
      return;
    }

    const success = await assignEvaluator(manuscriptId, {
      evaluatorId: Number(evaluatorId),
      evaluationDeadline: new Date(deadline).toISOString(),
    });

    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  const handleClose = () => {
    if (!assigning) {
      onClose();
    }
  };

  // Filter active evaluators
  const activeEvaluators = evaluators.filter((e) => e.isActive);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Assigner un évaluateur</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <Alert severity="info">
              Manuscrit : <strong>{manuscriptTitle}</strong>
            </Alert>

            {loadingEvaluators ? (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={24} />
              </Box>
            ) : activeEvaluators.length === 0 ? (
              <Alert severity="warning">
                Aucun évaluateur actif disponible. Veuillez d&apos;abord créer des évaluateurs.
              </Alert>
            ) : (
              <>
                <FormControl fullWidth required disabled={assigning}>
                  <InputLabel>Évaluateur</InputLabel>
                  <Select
                    value={evaluatorId}
                    onChange={(e) => setEvaluatorId(e.target.value as number)}
                    label="Évaluateur"
                  >
                    {activeEvaluators.map((evaluator) => (
                      <MenuItem key={evaluator.id} value={evaluator.id}>
                        <Box>
                          <Typography variant="body2" fontWeight="500">
                            {evaluator.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {evaluator.email}
                            {evaluator.institution && ` • ${evaluator.institution}`}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Date limite d'évaluation"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  fullWidth
                  disabled={assigning}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText="L'évaluateur recevra un email avec cette date limite"
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={assigning}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={assigning || !evaluatorId || !deadline || activeEvaluators.length === 0}
            startIcon={assigning ? <CircularProgress size={20} /> : null}
          >
            Assigner
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
