'use client';

import { 
  Box, 
  Typography, 
  Grid, 
  CircularProgress, 
  Alert, 
  Container,
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
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Bienvenue, {user?.fullName}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Tableau de bord Auteur
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Quick Actions Section */}
        <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <DashboardIcon sx={{ mr: 1 }} />
            Actions Rapides
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
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
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
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
            </Grid>
          </Grid>
        </Paper>

        {/* Statistics Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <StatsGrid stats={data.stats} />
          </Grid>
        </Grid>


      </Container>
    </RoleGuard>
  );
}
