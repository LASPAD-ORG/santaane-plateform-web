'use client';

import { Box, CircularProgress, Alert } from '@mui/material';
import { useFetchEvaluatorDashboard } from '../fetchers/useFetchEvaluatorDashboard';
import StatsGrid from './StatsGrid';
import DashboardBarChart from './DashboardBarChart';
import DashboardLineChart from './DashboardLineChart';

export default function EvaluatorDashboardContent() {
  const { data, loading, error } = useFetchEvaluatorDashboard();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">Erreur lors du chargement du dashboard évaluateur : {error.message}</Alert>;
  }
  if (!data) {
    return <Alert severity="info">Aucune donnée disponible</Alert>;
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <StatsGrid stats={data.stats} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
        <Box>
          <DashboardBarChart data={data.status_bar_chart} />
        </Box>
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
  );
}