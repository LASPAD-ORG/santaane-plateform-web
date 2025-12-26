'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

interface ManuscriptDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  manuscript: {
    title: string;
    abstract?: string;
    keywords?: string;
    themeName: string;
    sectionName: string;
    languageName: string;
    createdAt?: string;
  } | null;
}

export function ManuscriptDetailsDialog({
  open,
  onClose,
  manuscript,
}: ManuscriptDetailsDialogProps) {
  if (!manuscript) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { maxHeight: '80vh' }
      }}
    >
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <InfoOutlined color="primary" />
          <Typography variant="h6">
            Détails du manuscrit
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Titre */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Titre
            </Typography>
            <Typography variant="body1">
              {manuscript.title}
            </Typography>
          </Box>

          {/* Résumé */}
          {manuscript.abstract && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Résumé
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'justify', lineHeight: 1.6 }}>
                {manuscript.abstract}
              </Typography>
            </Box>
          )}

          <Divider />

          {/* Catégorisation */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Catégorisation
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={`Thème: ${manuscript.themeName}`}
                color="primary"
                variant="outlined"
                size="small"
              />
              <Chip
                label={`Rubrique: ${manuscript.sectionName}`}
                color="secondary"
                variant="outlined"
                size="small"
              />
              <Chip
                label={`Langue: ${manuscript.languageName}`}
                color="default"
                variant="outlined"
                size="small"
              />
            </Stack>
          </Box>

          {/* Mots-clés */}
          {manuscript.keywords && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Mots-clés
              </Typography>
              <Typography variant="body2">
                {manuscript.keywords}
              </Typography>
            </Box>
          )}

          {/* Date de soumission */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Date de soumission
            </Typography>
            <Typography variant="body2">
              {formatDate(manuscript.createdAt)}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}