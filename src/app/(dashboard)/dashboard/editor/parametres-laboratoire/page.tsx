'use client';

import { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import { useFetchLaboratory } from './fetchers/useFetchLaboratory';

export default function ParametresLaboratoirePage() {
  const { data: laboratory, loading, fetch } = useFetchLaboratory();

  useEffect(() => {
    fetch();
  }, []);

  if (loading) {
    return (
      <Typography variant="body1" color="text.secondary">
        Chargement...
      </Typography>
    );
  }

  if (!laboratory) {
    return (
      <Card sx={{ p: 6, textAlign: 'center' }}>
        <BusinessIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Laboratoire non trouvé
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Paramètres du Laboratoire
        </Typography>
        <Button variant="contained" startIcon={<EditIcon />}>
          Modifier
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Informations générales */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <BusinessIcon color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h5">{laboratory.name}</Typography>
                  <Chip
                    label={laboratory.isActive ? 'Actif' : 'Inactif'}
                    color={laboratory.isActive ? 'success' : 'default'}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">{laboratory.description}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Créé le
                  </Typography>
                  <Typography variant="body1">
                    {new Date(laboratory.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistiques */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">Statistiques</Typography>
                  <Divider />
                  <Box>
                    <Typography variant="h3" color="primary">
                      {laboratory.manuscriptCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manuscrits
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h3" color="secondary">
                      {laboratory.editorCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Éditeurs
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h3" color="info.main">
                      {laboratory.researcherCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chercheurs
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Éditeurs du laboratoire */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <PeopleIcon color="primary" />
                <Typography variant="h6">
                  Éditeurs du Laboratoire ({laboratory.editors.length})
                </Typography>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {laboratory.editors.map((editor) => (
                  <Grid item xs={12} sm={6} md={4} key={editor.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1">{editor.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {editor.email}
                        </Typography>
                        <Stack direction="row" spacing={1} mt={1}>
                          <Chip label={editor.role} size="small" color="primary" />
                          {editor.isActive && (
                            <Chip label="Actif" size="small" color="success" />
                          )}
                        </Stack>
                        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                          Depuis le:{' '}
                          {new Date(editor.assignedAt).toLocaleDateString('fr-FR')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
