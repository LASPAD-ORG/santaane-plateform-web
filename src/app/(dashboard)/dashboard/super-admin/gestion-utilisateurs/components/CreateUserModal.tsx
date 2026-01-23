'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Chip,
  Autocomplete,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { CreateUserData, useFetchRoles } from '../fetchers/useFetchGestionUtilisateurs';
import { ROLE_CONFIGS } from '@/config/roles';
import RoleSelector from './RoleSelector';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreateUser: (userData: CreateUserData) => Promise<void>;
}

const LABORATOIRE_OPTIONS = [
  { value: 'lab1', label: 'Laboratoire de Recherche 1' },
  { value: 'lab2', label: 'Laboratoire de Recherche 2' },
  { value: 'lab3', label: 'Laboratoire de Biologie' },
  { value: 'lab4', label: 'Laboratoire de Chimie' },
];

const SPECIALITE_OPTIONS = [
  { value: 'informatique', label: 'Informatique' },
  { value: 'biologie', label: 'Biologie' },
  { value: 'chimie', label: 'Chimie' },
  { value: 'physique', label: 'Physique' },
  { value: 'mathematiques', label: 'Mathématiques' },
];

// ROLE_OPTIONS will be dynamic

export function CreateUserModal({ open, onClose, onCreateUser }: CreateUserModalProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    prenom: '',
    nom: '',
    roleIds: [],
    laboratoire: '',
    specialite: '',
    telephone: '',
    sendWelcomeEmail: true,
  });

  const { data: availableRoles, fetch: fetchRoles, loading: rolesLoading } = useFetchRoles();

  useEffect(() => {
    fetchRoles();
  }, []);

  const roleOptions = availableRoles.map(role => ({
    id: role.id,
    label: role.name,
    color: (ROLE_CONFIGS as any)[role.name]?.color || '#757575',
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof CreateUserData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleRoleChange = (roleValue: number | number[] | undefined) => {
    if (Array.isArray(roleValue)) {
      setFormData(prev => ({ 
        ...prev, 
        roleIds: roleValue, 
        role_id: undefined 
      }));
    } else if (roleValue !== null && roleValue !== undefined) {
      setFormData(prev => ({ 
        ...prev, 
        roleIds: [roleValue], 
        role_id: roleValue 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        roleIds: [], 
        role_id: undefined 
      }));
    }

    // Clear role error
    if (errors.roleIds) {
      setErrors(prev => ({
        ...prev,
        roleIds: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.prenom) {
      newErrors.prenom = 'Le prénom est requis';
    }

    if (!formData.nom) {
      newErrors.nom = 'Le nom est requis';
    }

    if ((!formData.roleIds || formData.roleIds.length === 0) && !formData.role_id) {
      newErrors.roleIds = 'Au moins un rôle doit être sélectionné';
    }

    if (formData.telephone && !/^[\+]?[\d\s\-\(\)\.]{10,}$/.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    console.log('Données du formulaire avant envoi:', formData);
    console.log('Rôles sélectionnés - roleIds:', formData.roleIds);
    console.log('Rôle unique - role_id:', formData.role_id);

    setLoading(true);
    try {
      await onCreateUser(formData);
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      prenom: '',
      nom: '',
      roleIds: [],
      role_id: undefined,
      laboratoire: '',
      specialite: '',
      telephone: '',
      sendWelcomeEmail: true,
    });
    setErrors({});
    onClose();
  };

  const isHighPrivilegeRole = [...(formData.roleIds || []), formData.role_id].some(roleId => {
    if (!roleId) return false;
    const role = availableRoles.find(r => r.id === roleId);
    return role && ['SUPER_ADMIN', 'EDITOR'].includes(role.name);
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <PersonIcon />
        Créer un nouvel utilisateur
      </DialogTitle>

      <DialogContent>
        {isHighPrivilegeRole && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Attention : Vous êtes sur le point de créer un utilisateur avec des privilèges élevés
            (Super Admin ou Éditeur). Assurez-vous que cette personne a l'autorisation nécessaire.
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Informations personnelles */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PersonIcon />
              Informations personnelles
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Prénom *"
              value={formData.prenom}
              onChange={(e) => handleInputChange('prenom', e.target.value)}
              error={!!errors.prenom}
              helperText={errors.prenom}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Nom *"
              value={formData.nom}
              onChange={(e) => handleInputChange('nom', e.target.value)}
              error={!!errors.nom}
              helperText={errors.nom}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Téléphone"
              value={formData.telephone}
              onChange={(e) => handleInputChange('telephone', e.target.value)}
              error={!!errors.telephone}
              helperText={errors.telephone}
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          {/* Rôles et permissions */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 2 }}>
              Rôles et permissions
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <RoleSelector
              roles={availableRoles}
              onRoleChange={handleRoleChange}
              value={formData.roleIds && formData.roleIds.length > 0 ? formData.roleIds : formData.role_id}
              allowMultiple={true}
              error={errors.roleIds}
              helperText={errors.roleIds || 'Sélectionnez un ou plusieurs rôles pour cet utilisateur'}
            />
          </Grid>

          {/* Informations professionnelles */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 2 }}>
              <BusinessIcon />
              Informations professionnelles
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Laboratoire</InputLabel>
              <Select
                value={formData.laboratoire}
                label="Laboratoire"
                onChange={(e) => handleInputChange('laboratoire', e.target.value)}
              >
                <MenuItem value="">
                  <em>Aucun laboratoire</em>
                </MenuItem>
                {LABORATOIRE_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Spécialité</InputLabel>
              <Select
                value={formData.specialite}
                label="Spécialité"
                onChange={(e) => handleInputChange('specialite', e.target.value)}
              >
                <MenuItem value="">
                  <em>Aucune spécialité</em>
                </MenuItem>
                {SPECIALITE_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Options */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
              Options
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.sendWelcomeEmail}
                  onChange={(e) => handleInputChange('sendWelcomeEmail', e.target.checked)}
                />
              }
              label="Envoyer un email de bienvenue avec les instructions de connexion"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Création...' : 'Créer l\'utilisateur'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}