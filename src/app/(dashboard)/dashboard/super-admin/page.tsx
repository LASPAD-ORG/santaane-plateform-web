'use client';

import { Box, Typography, Card, CardContent, Paper, Grid } from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';

export default function SuperAdminDashboard() {
  const { user } = useAuthStore();

  return (
    <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard Platform - Super Admin
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Bienvenue, {user?.fullName} - Santaane Platform
        </Typography>

        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">24</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Laboratoires
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">1,248</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Utilisateurs totaux
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ArticleIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">5,432</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manuscrits publiés
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">+32%</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Croissance mensuelle
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Platform Overview */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Aperçu de la plateforme Santaane
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Les statistiques de la plateforme, graphiques et métriques détaillées apparaîtront ici.
              </Typography>
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Activité récente
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Les dernières actions des laboratoires et utilisateurs apparaîtront ici.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </RoleGuard>
  );
}
