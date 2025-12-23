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
import { useSectionActions } from '../fetchers/useSectionActions';
import type { Section } from '../fetchers/useFetchSections';

interface EditSectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  section: Section | null;
}

export default function EditSectionDialog({ open, onClose, onSuccess, section }: EditSectionDialogProps) {
  const [name, setName] = useState('');
  const [signeMin, setSigneMin] = useState('');
  const [signeMax, setSigneMax] = useState('');
  const { updateSection, loading } = useSectionActions();

  useEffect(() => {
    if (section) {
      setName(section.name);
      setSigneMin(section.signe_min.toString());
      setSigneMax(section.signe_max.toString());
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const min = parseInt(signeMin);
    const max = parseInt(signeMax);

    if (!section || !name.trim() || isNaN(min) || isNaN(max)) {
      return;
    }

    if (min < 1 || max < 1 || min > max) {
      return;
    }

    try {
      await updateSection(section.id, {
        name: name.trim(),
        signe_min: min,
        signe_max: max,
      });
      handleClose();
      onSuccess();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleClose = () => {
    setName('');
    setSigneMin('');
    setSigneMax('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Modifier la rubrique</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nom de la rubrique"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Nombre minimum de signes"
              type="number"
              value={signeMin}
              onChange={(e) => setSigneMin(e.target.value)}
              required
              fullWidth
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Nombre maximum de signes"
              type="number"
              value={signeMax}
              onChange={(e) => setSigneMax(e.target.value)}
              required
              fullWidth
              inputProps={{ min: 1 }}
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
            disabled={loading || !name.trim() || !signeMin || !signeMax}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
