'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Save,
  Person,
  Email,
  Work,
  Business,
  Description,
  Link as LinkIcon,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuthStore } from '@/stores/authStore';
import { useAlertStore } from '@/stores/alertStore';
import axios from 'axios';

interface ProfileData {
  fullName: string;
  email: string;
  orcidId: string;
  bio: string;
  position: string;
  institution: string;
}

export default function ProfilPage() {
  const { user, setUser } = useAuthStore();
  const { showSuccess, showError } = useAlertStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    fullName: '',
    email: '',
    orcidId: '',
    bio: '',
    position: '',
    institution: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/auth/me');
      
      if (response.data) {
        setFormData({
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          orcidId: response.data.orcidId || '',
          bio: response.data.bio || '',
          position: response.data.position || '',
          institution: response.data.institution || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Prepare data without email (cannot be changed)
      const { email, ...updateData } = formData;
      
      const response = await axios.put('/api/users/me/profile', updateData);
      
      // Update form with response data
      if (response.data) {
        setFormData({
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          orcidId: response.data.orcidId || '',
          bio: response.data.bio || '',
          position: response.data.position || '',
          institution: response.data.institution || '',
        });
      }
      
      // Update user in store
      if (user && response.data) {
        setUser({
          ...user,
          fullName: response.data.fullName,
          orcidId: response.data.orcidId,
        });
      }
      
      showSuccess('Profil mis à jour avec succès');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      showError(
        error.response?.data?.error || 'Erreur lors de la mise à jour du profil'
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (field: keyof typeof passwordData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      setChangingPassword(true);

      const response = await axios.put('/api/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      console.log('Password change response:', response.data);

      showSuccess('Mot de passe changé avec succès');
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail || 
                          error.response?.data?.errorCode ||
                          'Erreur lors du changement de mot de passe';
      
      showError(errorMessage);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleChange = (field: keyof ProfileData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Mon Profil
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Gérez vos informations personnelles et professionnelles
      </Typography>

      <form onSubmit={handleSubmit}>
        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="600" mb={2}>
              Informations personnelles
            </Typography>

            <Box display="flex" flexDirection="column" gap={3}>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Box flex={1} minWidth={{ xs: '100%', md: 'calc(50% - 8px)' }}>
                  <TextField
                    fullWidth
                    required
                    label="Nom complet"
                    value={formData.fullName}
                    onChange={handleChange('fullName')}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Box>

                <Box flex={1} minWidth={{ xs: '100%', md: 'calc(50% - 8px)' }}>
                  <TextField
                    fullWidth
                    disabled
                    label="Email"
                    value={formData.email}
                    helperText="L'email ne peut pas être modifié"
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Box>
              </Box>

              <TextField
                fullWidth
                label="ORCID ID"
                value={formData.orcidId}
                onChange={handleChange('orcidId')}
                placeholder="0000-0000-0000-0000"
                helperText="Identifiant ORCID pour la recherche académique"
                InputProps={{
                  startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Biographie"
                value={formData.bio}
                onChange={handleChange('bio')}
                placeholder="Parlez-nous de vous, vos domaines de recherche..."
                InputProps={{
                  startAdornment: (
                    <Description
                      sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 2 }}
                    />
                  ),
                }}
              />
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Informations professionnelles */}
            <Typography variant="h6" gutterBottom fontWeight="600" mb={2}>
              Informations professionnelles
            </Typography>

            <Box display="flex" gap={2} flexWrap="wrap">
              <Box flex={1} minWidth={{ xs: '100%', md: 'calc(50% - 8px)' }}>
                <TextField
                  fullWidth
                  label="Poste"
                  value={formData.position}
                  onChange={handleChange('position')}
                  placeholder="Ex: Professeur, Chercheur..."
                  InputProps={{
                    startAdornment: <Work sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Box>

              <Box flex={1} minWidth={{ xs: '100%', md: 'calc(50% - 8px)' }}>
                <TextField
                  fullWidth
                  label="Institution"
                  value={formData.institution}
                  onChange={handleChange('institution')}
                  placeholder="Ex: Université, Centre de recherche..."
                  InputProps={{
                    startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Box>
            </Box>

            {/* Actions */}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
              <Button
                variant="outlined"
                onClick={fetchProfile}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : <Save />}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </form>

      {/* Section changement de mot de passe */}
      <Card elevation={2} sx={{ mt: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="600" mb={2}>
            Changer le mot de passe
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Le mot de passe doit contenir au moins 8 caractères
          </Typography>

          <form onSubmit={handlePasswordSubmit}>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                fullWidth
                required
                type={showCurrentPassword ? 'text' : 'password'}
                label="Mot de passe actuel"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange('currentPassword')}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                      >
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box display="flex" gap={2} flexWrap="wrap">
                <Box flex={1} minWidth={{ xs: '100%', md: 'calc(50% - 8px)' }}>
                  <TextField
                    fullWidth
                    required
                    type={showNewPassword ? 'text' : 'password'}
                    label="Nouveau mot de passe"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange('newPassword')}
                    InputProps={{
                      startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box flex={1} minWidth={{ xs: '100%', md: 'calc(50% - 8px)' }}>
                  <TextField
                    fullWidth
                    required
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirmer le mot de passe"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange('confirmPassword')}
                    error={
                      passwordData.confirmPassword !== '' &&
                      passwordData.newPassword !== passwordData.confirmPassword
                    }
                    helperText={
                      passwordData.confirmPassword !== '' &&
                      passwordData.newPassword !== passwordData.confirmPassword
                        ? 'Les mots de passe ne correspondent pas'
                        : ''
                    }
                    InputProps={{
                      startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>

              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={changingPassword}
                  startIcon={changingPassword ? <CircularProgress size={20} /> : <Lock />}
                >
                  {changingPassword ? 'Changement...' : 'Changer le mot de passe'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
