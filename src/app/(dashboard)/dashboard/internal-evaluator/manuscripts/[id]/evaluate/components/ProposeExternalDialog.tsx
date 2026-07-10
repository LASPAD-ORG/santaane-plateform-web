'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import { useAlertStore } from '@/stores/alertStore';

interface Proposal {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
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
      const list = Array.isArray(data) ? data : [];
      setProposals(
        list.map((p: any) => ({
          id: p.id,
          firstName: p.first_name ?? p.firstName ?? '',
          lastName: p.last_name ?? p.lastName ?? '',
          email: p.email ?? '',
        }))
      );
    } catch {
      /* silencieux */
    } finally {
      setLoading(false);
    }
  }, [manuscriptId]);

  useEffect(() => {
    if (open) {
      loadProposals();
    }
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

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        /* la réponse peut ne pas avoir de corps JSON */
      }

      if (!res.ok) {
        const message =
          data?.detail || data?.message || data?.error || 'Cet évaluateur ne peut pas être proposé';
        showError(message);
        return;
      }

      showSuccess('Évaluateur externe proposé');
      setFirstName('');
      setLastName('');
      setEmail('');
      await loadProposals();
    } catch {
      showError('Erreur réseau lors de la proposition');
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

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        /* pas de corps JSON */
      }

      if (!res.ok) {
        const message = data?.detail || data?.message || 'Suppression impossible';
        showError(message);
        return;
      }

      setProposals((prev) => prev.filter((p) => p.id !== proposalId));
    } catch {
      showError('Erreur réseau lors de la suppression');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Proposer des évaluateurs externes
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ces propositions sont transmises à l&apos;éditeur, qui reste libre de son choix final.
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
          <TextField
            label="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 140 }}
          />
          <TextField
            label="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 140 }}
          />
        </Box>

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="small"
          fullWidth
          sx={{ mb: 1.5 }}
        />

        <Button
          variant="contained"
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
          onClick={handleAdd}
          disabled={!isValid || submitting}
        >
          Ajouter la proposition
        </Button>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Propositions ({proposals.length})
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
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
                  <IconButton edge="end" size="small" onClick={() => handleDelete(p.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${p.firstName} ${p.lastName}`.trim() || p.email}
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