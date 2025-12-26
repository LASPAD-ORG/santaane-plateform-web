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
import { useRoleActions } from '../fetchers/useRoleActions';
import type { Role } from '../fetchers/useFetchRoles';

interface EditRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: Role | null;
}

export default function EditRoleDialog({ open, onClose, onSuccess, role }: EditRoleDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { updateRole, loading } = useRoleActions();

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description);
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role || !name.trim() || !description.trim()) {
      return;
    }

    try {
      await updateRole(role.id, {
        name: name.trim(),
        description: description.trim(),
      });
      handleClose();
      onSuccess();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Modifier le rôle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nom du rôle"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            disabled={loading || !name.trim() || !description.trim()}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
