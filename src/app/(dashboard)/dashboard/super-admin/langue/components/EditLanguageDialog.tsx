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
import { useLanguageActions } from '../fetchers/useLanguageActions';
import type { Language } from '../fetchers/useFetchLanguages';

interface EditLanguageDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: Language | null;
}

export default function EditLanguageDialog({ open, onClose, onSuccess, language }: EditLanguageDialogProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const { updateLanguage, loading } = useLanguageActions();

  useEffect(() => {
    if (language) {
      setName(language.name);
      setCode(language.code);
    }
  }, [language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!language || !name.trim() || !code.trim()) {
      return;
    }

    try {
      await updateLanguage(language.id, {
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
        <DialogTitle>Modifier la langue</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nom de la langue"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Code de la langue"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              fullWidth
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
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
