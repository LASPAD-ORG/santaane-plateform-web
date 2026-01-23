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
import RoleSelector from './RoleSelector';

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
  const [roleId, setRoleId] = useState<number | undefined>(undefined);
  
  const { createUser, loading } = useCreateGestionUtilisateurs();
  const { data: roles } = useFetchRoles();

  const handleRoleChange = (roleValue: number | number[] | undefined) => {
    if (Array.isArray(roleValue)) {
      setRoleIds(roleValue);
      setRoleId(roleValue.length > 0 ? roleValue[0] : undefined);
    } else if (roleValue !== null && roleValue !== undefined) {
      setRoleIds([roleValue]);
      setRoleId(roleValue);
    } else {
      setRoleIds([]);
      setRoleId(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !prenom.trim() || !nom.trim() || (roleIds.length === 0 && !roleId)) {
      return;
    }

    const userData = {
      email: email.trim(),
      prenom: prenom.trim(),
      nom: nom.trim(),
      roleIds: roleIds.length > 0 ? roleIds : undefined,
      role_id: roleId || undefined,
      sendWelcomeEmail: true,
    };

    console.log('CreateUserDialog - Données envoyées:', userData);
    console.log('CreateUserDialog - roleIds:', roleIds);
    console.log('CreateUserDialog - roleId:', roleId);

    try {
      await createUser(userData);
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
    setRoleId(undefined);
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
              <RoleSelector
                roles={roles || []}
                onRoleChange={handleRoleChange}
                value={roleIds.length > 0 ? roleIds : (roleId || undefined)}
                allowMultiple={true}
              />
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
