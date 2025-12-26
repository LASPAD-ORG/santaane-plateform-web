'use client';

import { Box, Typography, Grid, CircularProgress, Alert, Container } from '@mui/material';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import { useFetchAuthorDashboard } from './fetchers/useFetchAuthorDashboard';
import StatsGrid from './components/StatsGrid';
import DashboardBarChart from './components/DashboardBarChart';
import DashboardLineChart from './components/DashboardLineChart';

export default function AuthorDashboard() {
  const { user } = useAuthStore();
  const { data, loading, error } = useFetchAuthorDashboard();

  if (loading) {
    return (
      <RoleGuard allowedRoles={[UserRole.AUTHOR]}>
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
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={[UserRole.AUTHOR]}>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="error">
            Erreur lors du chargement du dashboard: {error.message}
          </Alert>
        </Container>
      </RoleGuard>
    );
  }

  if (!data) {
    return (
      <RoleGuard allowedRoles={[UserRole.AUTHOR]}>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="info">Aucune donnée disponible</Alert>
        </Container>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={[UserRole.AUTHOR]}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Page Title */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Tableau de Bord
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenue, {user?.fullName}
          </Typography>
        </Box>

        {/* Statistics Grid */}
        <Box sx={{ mb: 6 }}>
          <StatsGrid stats={data.stats} />
        </Box>

        {/* Bar Chart Section */}
        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Répartition de vos Manuscrits
        </Typography>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12}>
            <DashboardBarChart data={data.bar_chart} />
          </Grid>
        </Grid>

        {/* Time Series - Submissions Section */}
        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Évolution de vos Soumissions
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <DashboardLineChart data={data.weekly_submissions} color="#3B82F6" />
          </Grid>
          <Grid item xs={12} lg={4}>
            <DashboardLineChart data={data.monthly_submissions} color="#8B5CF6" />
          </Grid>
          <Grid item xs={12} lg={4}>
            <DashboardLineChart data={data.yearly_submissions} color="#06B6D4" />
          </Grid>
        </Grid>
      </Container>
    </RoleGuard>
  );
}
