'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useThemeActions } from '../fetchers/useThemeActions';
import type { Theme } from '../fetchers/useFetchThemes';

interface EditThemeDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  theme: Theme | null;
}

export default function EditThemeDialog({ open, onClose, onSuccess, theme }: EditThemeDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { updateTheme, loading } = useThemeActions();

  useEffect(() => {
    if (theme) {
      setTitle(theme.title);
      setDescription(theme.description);
    }
  }, [theme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!theme || !title.trim() || !description.trim()) {
      return;
    }

    try {
      await updateTheme(theme.id, {
        title: title.trim(),
        description: description.trim(),
      });
      handleClose();
      onSuccess();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Modifier le thème</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Titre du thème"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              fullWidth
              multiline
              rows={3}
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
            disabled={loading || !title.trim() || !description.trim()}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
