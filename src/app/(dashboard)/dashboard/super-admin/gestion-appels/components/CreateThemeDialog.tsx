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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { useThemeActions } from '../fetchers/useThemeActions';

interface CreateThemeDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateThemeDialog({ open, onClose, onSuccess }: CreateThemeDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateLimite, setDateLimite] = useState<Date | null>(null);
  const { createTheme, loading } = useThemeActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !dateLimite) {
      return;
    }

    try {
      await createTheme({
        title: title.trim(),
        description: description.trim(),
        date_limite: dateLimite.toISOString(),
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
    setDateLimite(null);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Créer un nouvel appel</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Titre de l'appel"
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
              <DateTimePicker
                label="Date limite de soumission *"
                value={dateLimite}
                onChange={(newValue) => setDateLimite(newValue)}
                minDateTime={new Date()}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    helperText: "Sélectionnez la date et l'heure limite pour les soumissions"
                  }
                }}
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
              disabled={loading || !title.trim() || !description.trim() || !dateLimite}
            >
              Créer
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}
