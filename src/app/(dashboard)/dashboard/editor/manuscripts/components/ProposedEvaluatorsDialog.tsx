'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface Proposal {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

interface ProposedEvaluatorsDialogProps {
  open: boolean;
  onClose: () => void;
  manuscriptId: number;
}

export default function ProposedEvaluatorsDialog({
  open,
  onClose,
  manuscriptId,
}: ProposedEvaluatorsDialogProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProposals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/manuscripts/${manuscriptId}/proposed-evaluators`);
      if (!res.ok) {
        setError('Impossible de charger les propositions.');
        setProposals([]);
        return;
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setProposals(
        list.map((p: any) => ({
          id: p.id,
          firstName: p.first_name ?? p.firstName ?? '',
          lastName: p.last_name ?? p.lastName ?? '',
          email: p.email ?? '',
          status: p.status ?? 'proposed',
        }))
      );
    } catch {
      setError('Erreur réseau lors du chargement des propositions.');
      setProposals([]);
    } finally {
      setLoading(false);
    }
  }, [manuscriptId]);

  useEffect(() => {
    if (open) {
      loadProposals();
    }
  }, [open, loadProposals]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Évaluateurs externes proposés
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Propositions faites par l&apos;évaluateur interne. Vous restez libre de votre choix final.
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : proposals.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Aucune proposition pour ce manuscrit.
          </Typography>
        ) : (
          <List dense>
            {proposals.map((p) => (
              <ListItem
                key={p.id}
                secondaryAction={<Chip label={p.status} size="small" variant="outlined" />}
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