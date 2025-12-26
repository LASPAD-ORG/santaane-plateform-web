'use client';

import { Box, Typography, Grid, CircularProgress, Alert, Container, Stack, Divider } from '@mui/material';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import { useFetchEditorDashboard } from './fetchers/useFetchEditorDashboard';
import StatsGrid from './components/StatsGrid';
import DashboardBarChart from './components/DashboardBarChart';
import DashboardLineChart from './components/DashboardLineChart';

export default function EditorDashboard() {
  const { user } = useAuthStore();
  const { data, loading, error } = useFetchEditorDashboard();

  if (loading) {
    return (
      <RoleGuard allowedRoles={[UserRole.EDITOR]}>
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
      <RoleGuard allowedRoles={[UserRole.EDITOR]}>
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
      <RoleGuard allowedRoles={[UserRole.EDITOR]}>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="info">Aucune donnée disponible</Alert>
        </Container>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={[UserRole.EDITOR]}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="700">
            Tableau de Bord
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bienvenue, {user?.fullName}
          </Typography>
        </Box>

        {/* Stats */}
        <Box sx={{ mb: 4 }}>
          <StatsGrid stats={data.stats} />
        </Box>

        {/* Charts - 2x2 Grid */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
          Répartition
        </Typography>
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2,
            mb: 4,
          }}
        >
          <DashboardBarChart data={data.status_bar_chart} />
          <DashboardBarChart data={data.theme_bar_chart} />
          <DashboardBarChart data={data.section_bar_chart} />
          <DashboardBarChart data={data.language_bar_chart} />
        </Box>

        {/* Time Series */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
          Évolution
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 2,
            mb: 3,
          }}
        >
          <DashboardLineChart data={data.weekly_submissions} color="#3B82F6" />
          <DashboardLineChart data={data.monthly_submissions} color="#8B5CF6" />
          <DashboardLineChart data={data.yearly_submissions} color="#06B6D4" />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          <DashboardLineChart data={data.weekly_authors} color="#10B981" />
          <DashboardLineChart data={data.monthly_authors} color="#22C55E" />
          <DashboardLineChart data={data.yearly_authors} color="#14B8A6" />
        </Box>
      </Container>
    </RoleGuard>
  );
}
