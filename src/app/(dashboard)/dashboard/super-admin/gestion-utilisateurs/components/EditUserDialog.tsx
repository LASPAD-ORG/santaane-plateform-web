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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  CircularProgress,
} from '@mui/material';
import { useCreateGestionUtilisateurs } from '../fetchers/useCreateGestionUtilisateurs';
import { useFetchRoles } from '../../gestion-roles/fetchers/useFetchRoles';
import apiClient from '@/lib/api/client';

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string | null;
}

interface UserData {
  id: string;
  email: string;
  fullName: string;
  roles: Array<{ id: number; name: string }>;
}

export default function EditUserDialog({ open, onClose, onSuccess, userId }: EditUserDialogProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [roleIds, setRoleIds] = useState<number[]>([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [currentRoleIds, setCurrentRoleIds] = useState<number[]>([]);
  
  const { updateUser, loading } = useCreateGestionUtilisateurs();
  const { data: roles } = useFetchRoles();

  useEffect(() => {
    if (userId && open) {
      loadUser();
    }
  }, [userId, open]);

  const loadUser = async () => {
    if (!userId) return;
    
    setLoadingUser(true);
    try {
      const response = await apiClient.get<UserData>(`/users/${userId}`);
      const user = response.data;
      setEmail(user.email);
      setFullName(user.fullName);
      
      const userRoleIds = user.roles.map((r) => r.id);
      setRoleIds(userRoleIds);
      setCurrentRoleIds(userRoleIds);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !fullName.trim()) {
      return;
    }

    try {
      // Split fullName into prenom and nom for backend
      const nameParts = fullName.trim().split(' ');
      const prenom = nameParts[0] || '';
      const nom = nameParts.slice(1).join(' ') || nameParts[0];
      
      await updateUser(userId, {
        prenom,
        nom,
        roleIds,
      }, currentRoleIds);
      handleClose();
      onSuccess();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleClose = () => {
    setEmail('');
    setFullName('');
    setRoleIds([]);
    setCurrentRoleIds([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Modifier l'utilisateur</DialogTitle>
        <DialogContent>
          {loadingUser ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                disabled
                fullWidth
                helperText="L'email ne peut pas être modifié"
              />
              <TextField
                label="Nom complet"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                fullWidth
                autoFocus
                placeholder="Prénom Nom"
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
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading || loadingUser}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || loadingUser || !fullName.trim()}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
