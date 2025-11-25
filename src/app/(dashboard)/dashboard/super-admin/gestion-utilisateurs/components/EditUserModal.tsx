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
  Box,
  Typography,
  Chip,
  Autocomplete,
  Alert,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { User, UpdateUserData, UserStatus } from '../types';
import { UserRole } from '@/types/auth';
import { ROLE_CONFIGS } from '@/config/roles';
// Utility function for date formatting
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (userId: string, userData: UpdateUserData) => Promise<void>;
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

const ROLE_OPTIONS = Object.values(UserRole).map(role => ({
  value: role,
  label: ROLE_CONFIGS[role]?.label || role,
  color: ROLE_CONFIGS[role]?.color || '#757575',
}));

const STATUS_OPTIONS = [
  { value: UserStatus.ACTIVE, label: 'Actif', color: 'success' },
  { value: UserStatus.INACTIVE, label: 'Inactif', color: 'default' },
  { value: UserStatus.PENDING, label: 'En attente', color: 'warning' },
  { value: UserStatus.SUSPENDED, label: 'Suspendu', color: 'error' },
] as const;

export function EditUserModal({ open, onClose, user, onUpdateUser }: EditUserModalProps) {
  const [formData, setFormData] = useState<UpdateUserData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      const initialData: UpdateUserData = {
        prenom: user.prenom,
        nom: user.nom,
        roles: [...user.roles],
        laboratoire: user.laboratoire || '',
        specialite: user.specialite || '',
        telephone: user.telephone || '',
        status: user.status,
      };
      setFormData(initialData);
      setHasChanges(false);
    }
  }, [user]);

  const handleInputChange = (field: keyof UpdateUserData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    setHasChanges(true);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.prenom) {
      newErrors.prenom = 'Le prénom est requis';
    }

    if (!formData.nom) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.roles || formData.roles.length === 0) {
      newErrors.roles = 'Au moins un rôle doit être sélectionné';
    }

    if (formData.telephone && !/^[\+]?[\d\s\-\(\)\.]{10,}$/.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onUpdateUser(user.id, formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setHasChanges(false);
    onClose();
  };

  const isHighPrivilegeRole = formData.roles?.some(role => 
    [UserRole.SUPER_ADMIN, UserRole.EDITOR].includes(role)
  );

  const isStatusChange = formData.status !== user.status;

  const getUserInitials = () => {
    return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
  };


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <PersonIcon />
        Modifier l'utilisateur
      </DialogTitle>

      <DialogContent>
        {/* Informations utilisateur */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Avatar
            src={user.avatar}
            alt={`${user.prenom} ${user.nom}`}
            sx={{
              width: 60,
              height: 60,
              bgcolor: user.avatar ? 'transparent' : 'primary.main',
            }}
          >
            {!user.avatar && getUserInitials()}
          </Avatar>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">
              {user.prenom} {user.nom}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {user.email}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <HistoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Créé le {formatDate(user.dateCreation)}
              </Typography>
            </Box>
            {user.derniereConnexion && (
              <Typography variant="caption" color="text.secondary">
                Dernière connexion: {formatDate(user.derniereConnexion)}
              </Typography>
            )}
          </Box>
        </Box>

        {isHighPrivilegeRole && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Attention : Cet utilisateur possède des privilèges élevés (Super Admin ou Éditeur).
            Vérifiez soigneusement les modifications avant de les appliquer.
          </Alert>
        )}

        {isStatusChange && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Le statut de l'utilisateur va être modifié. Cela peut affecter son accès à la plateforme.
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
              value={formData.prenom || ''}
              onChange={(e) => handleInputChange('prenom', e.target.value)}
              error={!!errors.prenom}
              helperText={errors.prenom}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Nom *"
              value={formData.nom || ''}
              onChange={(e) => handleInputChange('nom', e.target.value)}
              error={!!errors.nom}
              helperText={errors.nom}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={user.email}
              disabled
              helperText="L'email ne peut pas être modifié"
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Téléphone"
              value={formData.telephone || ''}
              onChange={(e) => handleInputChange('telephone', e.target.value)}
              error={!!errors.telephone}
              helperText={errors.telephone}
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Divider sx={{ width: '100%', my: 2 }} />

          {/* Statut et rôles */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Statut et permissions
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={formData.status || ''}
                label="Statut"
                onChange={(e) => handleInputChange('status', e.target.value as UserStatus)}
              >
                {STATUS_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Autocomplete
              multiple
              options={ROLE_OPTIONS}
              getOptionLabel={(option) => option.label}
              value={ROLE_OPTIONS.filter(option => formData.roles?.includes(option.value))}
              onChange={(event, newValue) => {
                handleInputChange('roles', newValue.map(v => v.value));
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.value}
                    label={option.label}
                    style={{
                      backgroundColor: option.color + '20',
                      color: option.color,
                      border: `1px solid ${option.color}40`,
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Rôles *"
                  placeholder="Sélectionner des rôles"
                  error={!!errors.roles}
                  helperText={errors.roles}
                />
              )}
            />
          </Grid>

          <Divider sx={{ width: '100%', my: 2 }} />

          {/* Informations professionnelles */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <BusinessIcon />
              Informations professionnelles
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Laboratoire</InputLabel>
              <Select
                value={formData.laboratoire || ''}
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
                value={formData.specialite || ''}
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
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !hasChanges}
        >
          {loading ? 'Mise à jour...' : 'Sauvegarder'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}