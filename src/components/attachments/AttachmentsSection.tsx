'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  AttachFile,
  Download,
  Delete,
  UploadFile,
  Lock,
  Add,
} from '@mui/icons-material';
import { attachmentService } from '@/services/attachmentService';
import type { Attachment } from '@/types/attachment';
import { useAlertStore } from '@/stores/alertStore';

interface AttachmentsSectionProps {
  manuscriptId: number;
  role: 'author' | 'editor';
  currentUserId?: number;
  // Si fourni, l'upload est lie a une demande (reponse de l'auteur)
  requestId?: number;
  // Callback apres upload (ex. rafraichir les demandes)
  onChanged?: () => void;
  // Titre de la section (defaut "Pieces jointes")
  title?: string;
}

function formatSize(bytes?: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function formatDate(d: string): string {
  try {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

export default function AttachmentsSection({
  manuscriptId,
  role,
  currentUserId,
  requestId,
  onChanged,
  title = 'Pieces jointes',
}: AttachmentsSectionProps) {
  const { showSuccess, showError } = useAlertStore();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pieceTitle, setPieceTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibleToAuthor, setVisibleToAuthor] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await attachmentService.list(manuscriptId);
      setAttachments(data);
    } catch {
      showError('Erreur lors du chargement des pieces jointes');
    } finally {
      setLoading(false);
    }
  }, [manuscriptId, showError]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setFile(null);
    setPieceTitle('');
    setDescription('');
    setVisibleToAuthor(true);
  };

  const handleUpload = async () => {
    if (!file || !pieceTitle.trim()) {
      showError('Le fichier et le titre sont obligatoires');
      return;
    }
    setUploading(true);
    try {
      await attachmentService.upload(manuscriptId, {
        file,
        title: pieceTitle.trim(),
        description: description.trim() || undefined,
        visibleToAuthor: role === 'editor' ? visibleToAuthor : undefined,
        requestId,
      });
      showSuccess('Piece jointe ajoutee.');
      setDialogOpen(false);
      resetForm();
      await load();
      onChanged?.();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Erreur lors de l\'envoi de la piece';
      showError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (att: Attachment) => {
    try {
      await attachmentService.download(manuscriptId, att.id, att.originalFilename);
    } catch {
      showError('Erreur lors du telechargement');
    }
  };

  const handleDelete = async (att: Attachment) => {
    setDeletingId(att.id);
    try {
      await attachmentService.remove(manuscriptId, att.id);
      showSuccess('Piece supprimee.');
      await load();
      onChanged?.();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Erreur lors de la suppression';
      showError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const canDelete = (att: Attachment) =>
    role === 'editor' || (currentUserId !== undefined && att.uploadedById === currentUserId);

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack direction="row" alignItems="center" gap={1}>
          <AttachFile color="primary" />
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Stack>
        <Button
          variant="contained"
          size="small"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          Ajouter une piece
        </Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress size={28} />
        </Box>
      ) : attachments.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          Aucune piece jointe pour le moment.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {attachments.map((att) => (
            <Box
              key={att.id}
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
                    {att.title}
                  </Typography>
                  {!att.visibleToAuthor && (
                    <Tooltip title="Piece interne, non visible par l'auteur">
                      <Chip
                        size="small"
                        icon={<Lock sx={{ fontSize: 14 }} />}
                        label="Interne"
                        color="warning"
                        variant="outlined"
                      />
                    </Tooltip>
                  )}
                  <Chip
                    size="small"
                    label={att.uploadedByRole === 'editor' ? 'Editeur' : 'Auteur'}
                    variant="outlined"
                  />
                </Stack>
                {att.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {att.description}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {att.originalFilename}
                  {att.fileSize ? ` · ${formatSize(att.fileSize)}` : ''} · {formatDate(att.createdAt)}
                </Typography>
              </Box>
              <Stack direction="row" gap={0.5}>
                <Tooltip title="Telecharger">
                  <IconButton size="small" onClick={() => handleDownload(att)}>
                    <Download fontSize="small" />
                  </IconButton>
                </Tooltip>
                {canDelete(att) && (
                  <Tooltip title="Supprimer">
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(att)}
                        disabled={deletingId === att.id}
                      >
                        {deletingId === att.id ? <CircularProgress size={16} /> : <Delete fontSize="small" />}
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      {/* Dialogue d'upload */}
      <Dialog open={dialogOpen} onClose={() => !uploading && setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une piece jointe</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFile />}
              sx={{ alignSelf: 'flex-start' }}
            >
              {file ? 'Changer de fichier' : 'Choisir un fichier'}
              <input
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </Button>
            {file && (
              <Typography variant="body2" color="text.secondary">
                {file.name} ({formatSize(file.size)})
              </Typography>
            )}

            <TextField
              label="Titre de la piece"
              value={pieceTitle}
              onChange={(e) => setPieceTitle(e.target.value)}
              required
              fullWidth
              disabled={uploading}
            />
            <TextField
              label="Description (facultatif)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              disabled={uploading}
            />

            {role === 'editor' && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleToAuthor}
                    onChange={(e) => setVisibleToAuthor(e.target.checked)}
                    disabled={uploading}
                  />
                }
                label="Visible par l'auteur (transmettre la piece)"
              />
            )}
            {role === 'editor' && !visibleToAuthor && (
              <Typography variant="caption" color="warning.main">
                Cette piece restera interne et ne sera pas visible par l'auteur.
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={uploading}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={uploading || !file || !pieceTitle.trim()}
            startIcon={uploading ? <CircularProgress size={18} /> : <UploadFile />}
          >
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}