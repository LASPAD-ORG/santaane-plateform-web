'use client';

import { Box, Typography, Card, CardContent, Paper, Grid } from '@mui/material';
import {
  Groups as GroupsIcon,
  Article as ArticleIcon,
  SupervisorAccount as SupervisorIcon,
  CheckCircle as ApprovedIcon,
} from '@mui/icons-material';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';

export default function AuthorDashboard() {
  const { user } = useAuthStore();

  return (
    <RoleGuard allowedRoles={[UserRole.AUTHOR]}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard Laboratoire
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Bienvenue, {user?.fullName} - Gestion de votre laboratoire
        </Typography>

        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GroupsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">42</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chercheurs
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
                  <ArticleIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">184</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manuscrits du labo
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
                  <SupervisorIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">12</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rôles attribués ce mois
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
                  <ApprovedIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">8</Typography>
                    <Typography variant="body2" color="text.secondary">
                      En attente de publication
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Lab Overview */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Aperçu du laboratoire
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Les statistiques détaillées de votre laboratoire, graphiques et activités des chercheurs apparaîtront ici.
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
                Les dernières soumissions, attributions de rôles et publications apparaîtront ici.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </RoleGuard>
  );
}
