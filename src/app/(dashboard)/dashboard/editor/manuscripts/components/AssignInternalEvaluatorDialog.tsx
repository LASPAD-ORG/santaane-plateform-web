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

interface AssignInternalEvaluatorDialogProps {
  open: boolean;
  onClose: () => void;
  manuscriptId: number;
  manuscriptTitle: string;
  onSuccess?: () => void;
}

export default function AssignInternalEvaluatorDialog({
  open,
  onClose,
  manuscriptId,
  manuscriptTitle,
  onSuccess,
}: AssignInternalEvaluatorDialogProps) {
  const { assignInternalEvaluator, loading: assigning } = useAssignEvaluator();
  // Ne liste QUE les évaluateurs internes
  const { evaluators, loading: loadingEvaluators } = useEvaluators(1, 100, 'internal');

  const [evaluatorId, setEvaluatorId] = useState<number | ''>('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (open) {
      setEvaluatorId('');
      const defaultDeadline = new Date();
      defaultDeadline.setDate(defaultDeadline.getDate() + 30);
      setDeadline(defaultDeadline.toISOString().slice(0, 16));
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatorId || !deadline) return;

    const success = await assignInternalEvaluator(manuscriptId, {
      evaluatorId: Number(evaluatorId),
      evaluationDeadline: new Date(deadline).toISOString(),
    });

    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  const handleClose = () => {
    if (!assigning) onClose();
  };

  const activeEvaluators = evaluators.filter((e) => e.isActive);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Assigner un évaluateur interne</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <Alert severity="info">
              Manuscrit : <strong>{manuscriptTitle}</strong>
            </Alert>
            <Typography variant="body2" color="text.secondary">
              L&apos;évaluateur interne examine le manuscrit et le valide avant l&apos;assignation des évaluateurs externes.
            </Typography>

            {loadingEvaluators ? (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={24} />
              </Box>
            ) : activeEvaluators.length === 0 ? (
              <Alert severity="warning">
                Aucun évaluateur interne actif disponible. Créez d&apos;abord un évaluateur de type « interne ».
              </Alert>
            ) : (
              <>
                <FormControl fullWidth required disabled={assigning}>
                  <InputLabel>Évaluateur interne</InputLabel>
                  <Select
                    value={evaluatorId}
                    onChange={(e) => setEvaluatorId(e.target.value as number)}
                    label="Évaluateur interne"
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
                  InputLabelProps={{ shrink: true }}
                  helperText="L'évaluateur interne recevra un email avec cette date limite"
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