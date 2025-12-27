'use client';

import { Box, Typography, CircularProgress, Alert, Container } from '@mui/material';
import { useFetchSuperAdminDashboard } from './fetchers/useFetchSuperAdminDashboard';
import StatsGrid from './components/StatsGrid';
import DashboardBarChart from './components/DashboardBarChart';
import DashboardLineChart from './components/DashboardLineChart';

export default function SuperAdminDashboard() {
  const { data, loading, error } = useFetchSuperAdminDashboard();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Erreur lors du chargement du dashboard: {error.message}
        </Alert>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">Aucune donnée disponible</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Page Title */}
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
        Tableau de Bord Super Admin
      </Typography>

      {/* Statistics Grid */}
      <Box sx={{ mb: 4 }}>
        <StatsGrid stats={data.stats} />
      </Box>

      {/* Bar Charts Section */}
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 3, mt: 6 }}>
        Répartition des Soumissions
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 }, mb: 4 }}>
        {/* Status Distribution */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' } }}>
          <DashboardBarChart data={data.status_bar_chart} />
        </Box>

        {/* Theme Distribution */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' } }}>
          <DashboardBarChart data={data.theme_bar_chart} />
        </Box>

        {/* Section Distribution */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' } }}>
          <DashboardBarChart data={data.section_bar_chart} />
        </Box>

        {/* Language Distribution */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' } }}>
          <DashboardBarChart data={data.language_bar_chart} />
        </Box>
      </Box>

      {/* Time Series - Submissions Section */}
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 3, mt: 6 }}>
        Évolution des Soumissions
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 }, mb: 4 }}>
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 16px)' } }}>
          <DashboardLineChart data={data.weekly_submissions} color="#3B82F6" />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 16px)' } }}>
          <DashboardLineChart data={data.monthly_submissions} color="#8B5CF6" />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 16px)' } }}>
          <DashboardLineChart data={data.yearly_submissions} color="#06B6D4" />
        </Box>
      </Box>

      {/* Time Series - Authors Section */}
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 3, mt: 6 }}>
        Évolution des Auteurs
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 }, mb: 4 }}>
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 16px)' } }}>
          <DashboardLineChart data={data.weekly_authors} color="#10B981" />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 16px)' } }}>
          <DashboardLineChart data={data.monthly_authors} color="#22C55E" />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 16px)' } }}>
          <DashboardLineChart data={data.yearly_authors} color="#14B8A6" />
        </Box>
      </Box>
    </Container>
  );
}
