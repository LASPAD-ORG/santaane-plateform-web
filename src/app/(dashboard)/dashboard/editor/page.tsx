'use client';

import { Box, Typography, CircularProgress, Alert, Stack, Divider } from '@mui/material';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import { useFetchEditorDashboard } from './fetchers/useFetchEditorDashboard';
import StatsGrid from './components/StatsGrid';
import DashboardBarChart from './components/DashboardBarChart';
import DashboardLineChart from './components/DashboardLineChart';
import PageHeader from '@/components/ui/PageHeader';

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
        <Box>
          <Alert severity="error">
            Erreur lors du chargement du dashboard: {error.message}
          </Alert>
        </Box>
      </RoleGuard>
    );
  }

  if (!data) {
    return (
      <RoleGuard allowedRoles={[UserRole.EDITOR]}>
        <Box>
          <Alert severity="info">Aucune donnée disponible</Alert>
        </Box>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={[UserRole.EDITOR]}>
      <Box>
        <PageHeader
          title={`Bienvenue, ${user?.fullName}`}
          subtitle="Tableau de bord Éditeur"
        />

        {/* Stats */}
        <Box sx={{ mb: 4 }}>
          <StatsGrid stats={data.stats} />
        </Box>

        {/* Charts - 2x2 Grid */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
          Répartition
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 }, mb: 4 }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
            <DashboardBarChart data={data.status_bar_chart} />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
            <DashboardBarChart data={data.theme_bar_chart} />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
            <DashboardBarChart data={data.section_bar_chart} />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
            <DashboardBarChart data={data.language_bar_chart} />
          </Box>
        </Box>

        {/* Time Series */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
          Évolution
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 }, mb: 3 }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' } }}>
            <DashboardLineChart data={data.weekly_submissions} color="#3B82F6" />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' } }}>
            <DashboardLineChart data={data.monthly_submissions} color="#8B5CF6" />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' } }}>
            <DashboardLineChart data={data.yearly_submissions} color="#06B6D4" />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 } }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' } }}>
            <DashboardLineChart data={data.weekly_authors} color="#10B981" />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' } }}>
            <DashboardLineChart data={data.monthly_authors} color="#22C55E" />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' } }}>
            <DashboardLineChart data={data.yearly_authors} color="#14B8A6" />
          </Box>
        </Box>
      </Box>
    </RoleGuard>
  );
}
