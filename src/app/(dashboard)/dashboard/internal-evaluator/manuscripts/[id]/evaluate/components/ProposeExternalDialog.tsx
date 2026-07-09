'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Box,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAlertStore } from '@/stores/alertStore';

interface Proposal {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  createdAt: string;
}

interface ProposeExternalDialogProps {
  open: boolean;
  onClose: () => void;
  manuscriptId: number;
}

export default function ProposeExternalDialog({
  open,
  onClose,
  manuscriptId,
}: ProposeExternalDialogProps) {
  const showSuccess = useAlertStore((s) => s.showSuccess);
  const showError = useAlertStore((s) => s.showError);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const loadProposals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/manuscripts/${manuscriptId}/proposed-evaluators`);
      if (!res.ok) return;
      const data = await res.json();
      setProposals(Array.isArray(data) ? data : []);
    } catch {
      /* silencieux */
    } finally {
      setLoading(false);
    }
  }, [manuscriptId]);

  useEffect(() => {
    if (open) loadProposals();
  }, [open, loadProposals]);

  const isValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleAdd = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/manuscripts/${manuscriptId}/proposed-evaluators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || data?.message || 'Proposition impossible');
      }
      showSuccess('Évaluateur externe proposé');
      setFirstName('');
      setLastName('');
      setEmail('');
      await loadProposals();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Erreur lors de la proposition');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (proposalId: number) => {
    try {
      const res = await fetch(
        `/api/manuscripts/${manuscriptId}/proposed-evaluators/${proposalId}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || data?.message || 'Suppression impossible');
      }
      setProposals((prev) => prev.filter((p) => p.id !== proposalId));
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Proposer des évaluateurs externes
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ces propositions sont transmises à l&apos;éditeur, qui reste libre de son choix final.
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              size="small"
              fullWidth
            />
          </Stack>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            fullWidth
          />
          <Box>
            <Button
              variant="contained"
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
              onClick={handleAdd}
              disabled={!isValid || submitting}
            >
              Ajouter la proposition
            </Button>
          </Box>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Propositions ({proposals.length})
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        ) : proposals.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Aucune proposition pour le moment.
          </Typography>
        ) : (
          <List dense>
            {proposals.map((p) => (
              <ListItem
                key={p.id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDelete(p.id)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${p.firstName} ${p.lastName}`}
                  secondary={p.email}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}