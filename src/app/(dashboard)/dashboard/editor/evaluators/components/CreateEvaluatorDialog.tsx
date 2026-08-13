import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { useCreateEvaluator } from '../hooks/useCreateEvaluator';
import { CreateEvaluatorRequest } from '@/types/evaluator';

interface CreateEvaluatorDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateEvaluatorDialog({
  open,
  onClose,
  onSuccess,
}: CreateEvaluatorDialogProps) {
  const { createEvaluator, loading } = useCreateEvaluator();
  const [formData, setFormData] = useState<CreateEvaluatorRequest>({
    email: '',
    fullName: '',
    orcidId: '',
    bio: '',
    position: '',
    institution: '',
    evaluatorType: 'external',
  });

  const handleChange = (field: keyof CreateEvaluatorRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.fullName) {
      return;
    }

    const result = await createEvaluator(formData);
    if (result) {
      setFormData({
        email: '',
        fullName: '',
        orcidId: '',
        bio: '',
        position: '',
        institution: '',
        evaluatorType: 'external',
      });
      onSuccess();
      onClose();
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Créer un évaluateur</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              select
              label="Type d'evaluateur"
              value={formData.evaluatorType}
              onChange={handleChange('evaluatorType')}
              fullWidth
              disabled={loading}
            >
              <MenuItem value="external">Evaluateur externe</MenuItem>
              <MenuItem value="internal">Evaluateur interne</MenuItem>
            </TextField>
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Nom complet"
              value={formData.fullName}
              onChange={handleChange('fullName')}
              required
              fullWidth
              disabled={loading}
            />
            <TextField
              label="ORCID ID"
              value={formData.orcidId}
              onChange={handleChange('orcidId')}
              fullWidth
              disabled={loading}
              placeholder="0000-0000-0000-0000"
            />
            <TextField
              label="Biographie"
              value={formData.bio}
              onChange={handleChange('bio')}
              multiline
              rows={3}
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Poste"
              value={formData.position}
              onChange={handleChange('position')}
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Institution"
              value={formData.institution}
              onChange={handleChange('institution')}
              fullWidth
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.email || !formData.fullName}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Créer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
