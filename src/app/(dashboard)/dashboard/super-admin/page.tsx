'use client';

import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import { useDashboardStats } from './hooks/useDashboardStats';
import SubmissionsChart from './components/SubmissionsChart';
import UsersDistributionChart from './components/UsersDistributionChart';
import AcceptanceRateChart from './components/AcceptanceRateChart';
import ActivityFeed from './components/ActivityFeed';

export default function SuperAdminDashboard() {
  const { user } = useAuthStore();
  const stats = useDashboardStats();

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
                    <Typography variant="h4">{stats.totalLaboratoires}</Typography>
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
                    <Typography variant="h4">{stats.totalUsers}</Typography>
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
                    <Typography variant="h4">{stats.publishedManuscripts.toLocaleString()}</Typography>
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
                    <Typography variant="h4">+{stats.monthlyGrowth}%</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Croissance mensuelle
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Submissions Chart */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <SubmissionsChart />
          </Grid>

          {/* Acceptance Rate Chart */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <AcceptanceRateChart />
          </Grid>

          {/* Users Distribution Chart */}
          <Grid size={{ xs: 12, md: 6 }}>
            <UsersDistributionChart />
          </Grid>

          {/* Recent Activity */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ActivityFeed />
          </Grid>
        </Grid>
      </Box>
    </RoleGuard>
  );
}
