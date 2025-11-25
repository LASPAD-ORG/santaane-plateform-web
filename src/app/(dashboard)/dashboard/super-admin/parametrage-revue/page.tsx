'use client';

import { Box, Typography, Button, TextField, Paper, Grid, CircularProgress } from '@mui/material';
import { Save, Settings } from '@mui/icons-material';
import { useJournalConfig } from './hooks/useJournalConfig';

export default function ParametrageRevuePage() {
  const { config, loading, updateConfig, saveConfig } = useJournalConfig();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Settings sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1">
            Paramétrage de la revue
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {/* Nom de la revue */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Nom de la revue"
              value={config.name}
              onChange={(e) => updateConfig('name', e.target.value)}
              disabled={loading}
            />
          </Grid>

          {/* ISSN */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="ISSN"
              value={config.issn}
              onChange={(e) => updateConfig('issn', e.target.value)}
              disabled={loading}
            />
          </Grid>

          {/* Description */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={config.description}
              onChange={(e) => updateConfig('description', e.target.value)}
              disabled={loading}
            />
          </Grid>

          {/* Politique éditoriale */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Politique éditoriale"
              value={config.editorialPolicy}
              onChange={(e) => updateConfig('editorialPolicy', e.target.value)}
              disabled={loading}
            />
          </Grid>

          {/* Logo (Simulation) */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="URL du Logo"
              value={config.logoUrl}
              onChange={(e) => updateConfig('logoUrl', e.target.value)}
              disabled={loading}
              helperText="Entrez l'URL de l'image du logo"
            />
          </Grid>

          {/* Actions */}
          <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
              onClick={saveConfig}
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
