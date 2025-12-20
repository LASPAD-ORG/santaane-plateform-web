'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { useFetchUtilisateurs } from './fetchers/useFetchUtilisateurs';
import { UtilisateurCard } from './components/UtilisateurCard';

export default function GestionUtilisateursPage() {
  const { data: utilisateurs, loading, fetch } = useFetchUtilisateurs();
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    fetch();
  }, []);

  const filteredUtilisateurs = utilisateurs?.filter((utilisateur) => {
    if (roleFilter === 'all') return true;
    return utilisateur.roles.includes(roleFilter);
  });

  const roleCounts = {
    all: utilisateurs?.length || 0,
    AUTHOR: utilisateurs?.filter((u) => u.roles.includes('AUTHOR')).length || 0,
    MENTOR: utilisateurs?.filter((u) => u.roles.includes('MENTOR')).length || 0,
    EVALUATOR:
      utilisateurs?.filter((u) => u.roles.includes('EVALUATOR')).length || 0,
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestion des Utilisateurs
        </Typography>
      </Stack>

      <Card sx={{ mb: 3, p: 2 }}>
        <Tabs
          value={roleFilter}
          onChange={(_, value) => setRoleFilter(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={`Tous (${roleCounts.all})`} value="all" />
          <Tab label={`Auteurs (${roleCounts.AUTHOR})`} value="AUTHOR" />
          <Tab label={`Mentors (${roleCounts.MENTOR})`} value="MENTOR" />
          <Tab label={`Évaluateurs (${roleCounts.EVALUATOR})`} value="EVALUATOR" />
        </Tabs>
      </Card>

      {loading && (
        <Typography variant="body1" color="text.secondary">
          Chargement...
        </Typography>
      )}

      {!loading && filteredUtilisateurs && filteredUtilisateurs.length === 0 && (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <GroupIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Aucun utilisateur trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {roleFilter === 'all'
              ? 'Aucun utilisateur dans votre laboratoire pour le moment.'
              : `Aucun utilisateur avec le rôle "${roleFilter}".`}
          </Typography>
        </Card>
      )}

      {!loading && filteredUtilisateurs && filteredUtilisateurs.length > 0 && (
        <Grid container spacing={3}>
          {filteredUtilisateurs.map((utilisateur) => (
            <Grid item xs={12} md={6} lg={4} key={utilisateur.id}>
              <UtilisateurCard utilisateur={utilisateur} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
