import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  RateReview,
  Visibility,
} from '@mui/icons-material';
import { ManuscriptStatus } from '@/types/manuscript';
import axios from 'axios';
import { useAlertStore } from '@/stores/alertStore';

interface ManuscriptStatusModalProps {
  open: boolean;
  onClose: () => void;
  manuscriptId: number;
  manuscriptTitle: string;
  currentStatus: ManuscriptStatus;
  onSuccess?: () => void;
}

const STATUS_OPTIONS = [
  { value: 'accepted' as ManuscriptStatus, label: 'Accepter', icon: <CheckCircle color="success" /> },
  { value: 'rejected' as ManuscriptStatus, label: 'Rejeter', icon: <Cancel color="error" /> },
  { value: 'revision_requested' as ManuscriptStatus, label: 'Accepter provisoirement', icon: <RateReview sx={{ color: '#4caf50' }} /> },
  { value: 'published' as ManuscriptStatus, label: 'Publier', icon: <Visibility color="primary" /> },
];

const STATUS_LABELS: Record<ManuscriptStatus, string> = {
  submitted: 'Soumis',
  re_submitted: 'Re-soumis',
  accepted: 'Accepté',
  rejected: 'Rejeté',
  revision_requested: 'Révision demandée',
  published: 'Publié',
};

export default function ManuscriptStatusModal({
  open,
  onClose,
  manuscriptId,
  manuscriptTitle,
  currentStatus,
  onSuccess,
}: ManuscriptStatusModalProps) {
  const { showSuccess, showError } = useAlertStore();
  const [newStatus, setNewStatus] = useState<ManuscriptStatus | ''>('');
  const [emailComment, setEmailComment] = useState('');
  const [updating, setUpdating] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setNewStatus('');
      setEmailComment('');
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newStatus) {
      console.log('❌ Validation échouée: aucun statut sélectionné');
      showError('Veuillez sélectionner un statut');
      return;
    }

    // Log des données avant envoi
    const payload = {
      manuscript_id: manuscriptId,
      new_status: newStatus,
      email_comment: emailComment.trim() || undefined,
    };
    
    console.log('📤 Envoi du payload:', {
      manuscriptId,
      newStatus,
      emailComment: emailComment.trim() || 'undefined',
      payload
    });

    setUpdating(true);
    try {
      const response = await axios.put(`/api/manuscripts/detail/${manuscriptId}/status`, payload);
      console.log('✅ Succès de la mise à jour:', response.data);
      
      // Notification de succès personnalisée
      const statusLabel = STATUS_LABELS[newStatus];
      const hasComment = emailComment.trim().length > 0;
      
      let successMessage = `Statut du manuscrit mis à jour avec succès : "${statusLabel}"`;
      if (hasComment) {
        successMessage += '\nUn email a été envoyé à l\'auteur avec votre commentaire.';
      } else {
        successMessage += '\nUn email de notification a été envoyé à l\'auteur.';
      }
      
      showSuccess(successMessage);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      
      // Notification d'erreur détaillée
      let errorMessage = 'Erreur lors de la mise à jour du statut';
      
      if (axios.isAxiosError(error)) {
        console.error('❌ Détails de l\'erreur:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config?.data
        });
        
        if (error.response?.status === 401) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        } else if (error.response?.status === 403) {
          errorMessage = 'Permission refusée pour modifier ce manuscrit.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Manuscrit non trouvé.';
        } else if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      }
      
      showError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleClose = () => {
    if (!updating) {
      onClose();
    }
  };

  const isFormValid = newStatus !== '';

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      onClick={(e) => e.stopPropagation()}
    >
      <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <DialogTitle>Gestion du statut du manuscrit</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} pt={1}>
            {/* Contextual text */}
            <Typography variant="body1" color="text.secondary">
              Manuscrit : <strong>"{manuscriptTitle}"</strong>
            </Typography>

            {/* Status select */}
            <FormControl fullWidth required disabled={updating} variant="outlined">
              <InputLabel 
                id="new-status-label"
              >
                Nouveau statut
              </InputLabel>
              <Select
                labelId="new-status-label"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ManuscriptStatus)}
                label="Nouveau statut"
                MenuProps={{
                  onClick: (e) => e.stopPropagation(),
                }}
              >
                <MenuItem value="">
                  <em>Sélectionner un statut</em>
                </MenuItem>
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem 
                    key={option.value} 
                    value={option.value}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      {option.icon}
                      <Typography>{option.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Email comment */}
            <TextField
              label="Commentaire pour l'auteur (optionnel)"
              placeholder="Ex : Manuscrit non conforme à nos règlements éditoriaux..."
              multiline
              rows={4}
              value={emailComment}
              onChange={(e) => {
                const newValue = e.target.value;
                setEmailComment(newValue);
                console.log('📝 Changement du commentaire:', {
                  value: newValue,
                  isEmpty: !newValue.trim(),
                  length: newValue.length
                });
              }}
              fullWidth
              disabled={updating}
              helperText="Ce message sera envoyé par email à l'auteur."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={updating}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isFormValid || updating}
            startIcon={updating ? <CircularProgress size={20} /> : null}
          >
            Valider
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
