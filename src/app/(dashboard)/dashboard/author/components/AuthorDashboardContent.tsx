'use client';

import { Box, Typography, CircularProgress, Alert, Card, Paper } from '@mui/material';
import {
  Add as AddIcon,
  ArticleOutlined as ManuscriptIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useFetchAuthorDashboard } from '../fetchers/useFetchAuthorDashboard';
import StatsGrid from './StatsGrid';

export default function AuthorDashboardContent() {
  const { data, loading, error } = useFetchAuthorDashboard();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">Erreur lors du chargement du dashboard auteur : {error.message}</Alert>;
  }
  if (!data) {
    return <Alert severity="info">Aucune donnée disponible</Alert>;
  }

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <DashboardIcon sx={{ mr: 1 }} />
          Actions rapides
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
            <Link href="/dashboard/author/soumission" style={{ textDecoration: 'none' }}>
              <Card sx={{ p: 2, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 3, bgcolor: 'primary.50' } }}>
                <AddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">Nouveau manuscrit</Typography>
                <Typography variant="body2" color="text.secondary">Soumettre un article</Typography>
              </Card>
            </Link>
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
            <Link href="/dashboard/author/manuscripts" style={{ textDecoration: 'none' }}>
              <Card sx={{ p: 2, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 3, bgcolor: 'success.50' } }}>
                <ManuscriptIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">Mes manuscrits</Typography>
                <Typography variant="body2" color="text.secondary">Voir tous les manuscrits</Typography>
              </Card>
            </Link>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <StatsGrid stats={data.stats} />
      </Box>
    </Box>
  );
}