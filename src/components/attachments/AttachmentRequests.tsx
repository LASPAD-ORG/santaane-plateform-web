'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Assignment, Add, CheckCircle, HourglassEmpty, UploadFile } from '@mui/icons-material';
import { attachmentService } from '@/services/attachmentService';
import type { AttachmentRequest } from '@/types/attachment';
import { useAlertStore } from '@/stores/alertStore';

interface AttachmentRequestsProps {
  manuscriptId: number;
  role: 'author' | 'editor';
  // Pour l'auteur : callback pour ouvrir l'upload lie a une demande
  onRespond?: (request: AttachmentRequest) => void;
  // Pour rafraichir depuis l'exterieur
  reloadSignal?: number;
}

function formatDate(d: string): string {
  try {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

export default function AttachmentRequests({
  manuscriptId,
  role,
  onRespond,
  reloadSignal,
}: AttachmentRequestsProps) {
  const { showSuccess, showError } = useAlertStore();
  const [requests, setRequests] = useState<AttachmentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await attachmentService.listRequests(manuscriptId);
      setRequests(data);
    } catch {
      showError('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  }, [manuscriptId, showError]);

  useEffect(() => {
    load();
  }, [load, reloadSignal]);

  const handleCreate = async () => {
    if (!title.trim()) {
      showError('Le titre de la demande est obligatoire');
      return;
    }
    setCreating(true);
    try {
      await attachmentService.createRequest(manuscriptId, {
        title: title.trim(),
        description: description.trim() || undefined,
      });
      showSuccess('Demande envoyee a l\'auteur.');
      setDialogOpen(false);
      setTitle('');
      setDescription('');
      await load();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Erreur lors de la creation de la demande';
      showError(msg);
    } finally {
      setCreating(false);
    }
  };

  // Cote auteur : ne montrer la section que s'il y a des demandes
  if (role === 'author' && !loading && requests.length === 0) {
    return null;
  }

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Assignment color="primary" />
          <Typography variant="h6" fontWeight={600}>
            {role === 'editor' ? 'Demandes de pieces a l\'auteur' : 'Pieces demandees par l\'editeur'}
          </Typography>
        </Stack>
        {role === 'editor' && (
          <Button variant="contained" size="small" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
            Demander une piece
          </Button>
        )}
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress size={28} />
        </Box>
      ) : requests.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          Aucune demande pour le moment.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {requests.map((req) => {
            const fulfilled = req.status === 'fulfilled';
            return (
              <Box
                key={req.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 2,
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                    <Typography variant="subtitle2" fontWeight={600}>
                      {req.title}
                    </Typography>
                    <Chip
                      size="small"
                      icon={fulfilled ? <CheckCircle sx={{ fontSize: 14 }} /> : <HourglassEmpty sx={{ fontSize: 14 }} />}
                      label={fulfilled ? 'Fournie' : 'En attente'}
                      color={fulfilled ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </Stack>
                  {req.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {req.description}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Demandee le {formatDate(req.createdAt)}
                    {req.fulfilledAt ? ` · Fournie le ${formatDate(req.fulfilledAt)}` : ''}
                  </Typography>
                </Box>
                {role === 'author' && !fulfilled && onRespond && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<UploadFile />}
                    onClick={() => onRespond(req)}
                  >
                    Repondre
                  </Button>
                )}
              </Box>
            );
          })}
        </Stack>
      )}

      {/* Dialogue de creation de demande (editeur) */}
      <Dialog open={dialogOpen} onClose={() => !creating && setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Demander une piece a l'auteur</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Piece demandee"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              disabled={creating}
              placeholder="Ex. : Version anonymisee du manuscrit"
            />
            <TextField
              label="Precisions (facultatif)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={3}
              disabled={creating}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={creating}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={creating || !title.trim()}
            startIcon={creating ? <CircularProgress size={18} /> : <Add />}
          >
            Envoyer la demande
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}