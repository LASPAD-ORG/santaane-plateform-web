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
} from '@mui/material';
import {
  Save,
  Person,
  Email,
  Work,
  Business,
  Description,
  Link as LinkIcon,
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
  const [formData, setFormData] = useState<ProfileData>({
    fullName: '',
    email: '',
    orcidId: '',
    bio: '',
    position: '',
    institution: '',
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

  const handleChange = (field: keyof ProfileData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
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
    </Box>
  );
}
