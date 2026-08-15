'use client';

import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useFetchSuperAdminDashboard } from '../fetchers/useFetchSuperAdminDashboard';
import StatsGrid from './StatsGrid';
import DashboardBarChart from './DashboardBarChart';
import DashboardLineChart from './DashboardLineChart';

export default function SuperAdminDashboardContent() {
  const { data, loading, error } = useFetchSuperAdminDashboard();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">Erreur lors du chargement du dashboard super admin : {error.message}</Alert>;
  }
  if (!data) {
    return <Alert severity="info">Aucune donnée disponible</Alert>;
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <StatsGrid stats={data.stats} />
      </Box>

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 4 }}>
        Répartition des soumissions
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 }, mb: 4 }}>
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' } }}>
          <DashboardBarChart data={data.status_bar_chart} />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' } }}>
          <DashboardBarChart data={data.theme_bar_chart} />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' } }}>
          <DashboardBarChart data={data.section_bar_chart} />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' } }}>
          <DashboardBarChart data={data.language_bar_chart} />
        </Box>
      </Box>

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 4 }}>
        Évolution des soumissions
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

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 4 }}>
        Évolution des auteurs
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
    </Box>
  );
}