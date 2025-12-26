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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { useCreateGestionUtilisateurs } from '../fetchers/useCreateGestionUtilisateurs';
import { useFetchRoles } from '../../../developer/gestion-roles/fetchers/useFetchRoles';

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserDialog({ open, onClose, onSuccess }: CreateUserDialogProps) {
  const [email, setEmail] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [roleIds, setRoleIds] = useState<number[]>([]);
  
  const { createUser, loading } = useCreateGestionUtilisateurs();
  const { data: roles } = useFetchRoles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !prenom.trim() || !nom.trim()) {
      return;
    }

    try {
      await createUser({
        email: email.trim(),
        prenom: prenom.trim(),
        nom: nom.trim(),
        roleIds,
        sendWelcomeEmail: true,
      });
      handleClose();
      onSuccess();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleClose = () => {
    setEmail('');
    setPrenom('');
    setNom('');
    setRoleIds([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Rôles</InputLabel>
              <Select
                multiple
                value={roleIds}
                onChange={(e) => setRoleIds(e.target.value as number[])}
                input={<OutlinedInput label="Rôles" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((roleId) => {
                      const role = roles.find((r) => r.id === roleId);
                      return <Chip key={roleId} label={role?.name || roleId} size="small" />;
                    })}
                  </Box>
                )}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !email.trim() || !prenom.trim() || !nom.trim()}
          >
            Créer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
