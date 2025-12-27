'use client';

import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
  Avatar,
  IconButton,
  Paper,
  Stack
} from '@mui/material';
import { 
  Add as AddIcon,
  ArticleOutlined as ManuscriptIcon,
  Notifications as NotificationIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import { useFetchAuthorDashboard } from './fetchers/useFetchAuthorDashboard';
import StatsGrid from './components/StatsGrid';
import PageHeader from '@/components/ui/PageHeader';

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
      <RoleGuard allowedRoles={[UserRole.AUTHOR]}>
        <Box>
          <Alert severity="info">Aucune donnée disponible</Alert>
        </Box>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={[UserRole.AUTHOR]}>
      <Box>
        <PageHeader
          title={`Bienvenue, ${user?.fullName}`}
          subtitle="Tableau de bord Auteur"
        />

        {/* Quick Actions Section */}
        <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <DashboardIcon sx={{ mr: 1 }} />
            Actions Rapides
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
              <Link href="/dashboard/author/soumission" style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                      bgcolor: 'primary.50'
                    }
                  }}
                >
                  <AddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Nouveau Manuscrit
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Soumettre un article
                  </Typography>
                </Card>
              </Link>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
              <Link href="/dashboard/author/manuscripts" style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                      bgcolor: 'success.50'
                    }
                  }}
                >
                  <ManuscriptIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Mes Manuscrits
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Voir tous les manuscrits
                  </Typography>
                </Card>
              </Link>
            </Box>
          </Box>
        </Paper>

        {/* Statistics Section */}
        <Box sx={{ mb: 4 }}>
          <StatsGrid stats={data.stats} />
        </Box>


      </Box>
    </RoleGuard>
  );
}
