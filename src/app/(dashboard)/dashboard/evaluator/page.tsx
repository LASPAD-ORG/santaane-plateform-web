'use client';

import { Box, Typography, CircularProgress, Alert, Stack } from '@mui/material';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import { useFetchEvaluatorDashboard } from './fetchers/useFetchEvaluatorDashboard';
import StatsGrid from './components/StatsGrid';
import DashboardBarChart from './components/DashboardBarChart';
import DashboardLineChart from './components/DashboardLineChart';
import PageHeader from '@/components/ui/PageHeader';

export default function EvaluatorDashboard() {
  const { user } = useAuthStore();
  const { data, loading, error } = useFetchEvaluatorDashboard();

  if (loading) {
    return (
      <RoleGuard allowedRoles={[UserRole.EVALUATOR]}>
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
      <RoleGuard allowedRoles={[UserRole.EVALUATOR]}>
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
      <RoleGuard allowedRoles={[UserRole.EVALUATOR]}>
        <Box>
          <Alert severity="info">Aucune donnée disponible</Alert>
        </Box>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={[UserRole.EVALUATOR]}>
      <Box>
        <PageHeader
          title={`Bienvenue, ${user?.fullName}`}
          subtitle="Tableau de bord Évaluateur"
        />

        {/* Statistics */}
        <Box sx={{ mb: 4 }}>
          <StatsGrid stats={data.stats} />
        </Box>

        {/* Charts Grid */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
          {/* Bar Chart - Full width */}
          <Box>
            <DashboardBarChart data={data.status_bar_chart} />
          </Box>

          {/* Time Series - 3 columns */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 } }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
              <DashboardLineChart data={data.weekly_evaluations} color="#3B82F6" />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
              <DashboardLineChart data={data.monthly_evaluations} color="#8B5CF6" />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
              <DashboardLineChart data={data.yearly_evaluations} color="#06B6D4" />
            </Box>
          </Box>
        </Box>
      </Box>
    </RoleGuard>
  );
}
