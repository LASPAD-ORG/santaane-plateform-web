'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useLanguageActions } from '../fetchers/useLanguageActions';

interface CreateLanguageDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateLanguageDialog({ open, onClose, onSuccess }: CreateLanguageDialogProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const { createLanguage, loading } = useLanguageActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !code.trim()) {
      return;
    }

    try {
      await createLanguage({
        name: name.trim(),
        code: code.trim().toLowerCase(),
      });
      handleClose();
      onSuccess();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleClose = () => {
    setName('');
    setCode('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Créer une nouvelle langue</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nom de la langue"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoFocus
              placeholder="Ex: Français"
            />
            <TextField
              label="Code de la langue"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              fullWidth
              placeholder="Ex: fr"
              helperText="Code ISO 639-1 (2 lettres)"
              inputProps={{ maxLength: 5 }}
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
            disabled={loading || !name.trim() || !code.trim()}
          >
            Créer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
