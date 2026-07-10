'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface Proposal {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface EditorProposedEvaluatorsDialogProps {
  open: boolean;
  onClose: () => void;
  manuscriptId: number;
}

export default function EditorProposedEvaluatorsDialog({
  open,
  onClose,
  manuscriptId,
}: EditorProposedEvaluatorsDialogProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
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
      load();
    }
  }, [open, load]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Evaluateurs externes proposes
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Propositions faites par l&apos;evaluateur interne. Vous restez libre de votre choix final.
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
              <ListItem key={p.id}>
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