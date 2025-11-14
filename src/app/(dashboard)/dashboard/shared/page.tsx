'use client';

import { Box, Typography, Card, CardContent, Paper, Grid, Chip } from '@mui/material';
import {
  Article as ArticleIcon,
  Create as CreateIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import { getRoleLabel, getRoleColor } from '@/config/roles';

export default function SharedDashboard() {
  const { user } = useAuthStore();

  // Determine what features to show based on user roles
  const hasAuthorRole = user?.roles.includes(UserRole.AUTHOR);
  const hasMentorRole = user?.roles.includes(UserRole.MENTOR);
  const hasEvaluatorRole = user?.roles.includes(UserRole.EVALUATOR);

  return (
    <RoleGuard allowedRoles={[UserRole.AUTHOR, UserRole.MENTOR, UserRole.EVALUATOR]}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h4">
            Dashboard
          </Typography>
  
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Bienvenue, {user?.fullName} !
        </Typography>

        <Grid container spacing={3}>
          {/* AUTHOR features - everyone has these */}
          {hasAuthorRole && (
            <>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ArticleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                      <Box>
                        <Typography variant="h4">12</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mes Articles
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CreateIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                      <Box>
                        <Typography variant="h4">3</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Brouillons
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {/* MENTOR features - MENTOR and EVALUATOR have these */}
          {hasMentorRole && (
            <>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SchoolIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                      <Box>
                        <Typography variant="h4">8</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Auteurs accompagnés
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {/* EVALUATOR features - only EVALUATOR has these */}
          {hasEvaluatorRole && (
            <>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AssignmentIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                      <Box>
                        <Typography variant="h4">5</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Articles à évaluer
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {/* Main content area */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Aperçu de vos activités
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Vos statistiques et graphiques détaillés apparaîtront ici.
              </Typography>

              {/* Show role-specific information */}
              <Box sx={{ mt: 3 }}>
                {hasAuthorRole && (
                  <Typography variant="body2" color="text.secondary">
                    • En tant qu'<strong>Auteur</strong>, vous pouvez créer et gérer vos manuscrits.
                  </Typography>
                )}
                {hasMentorRole && (
                  <Typography variant="body2" color="text.secondary">
                    • En tant que <strong>Mentor</strong>, vous accompagnez d'autres auteurs dans leur rédaction.
                  </Typography>
                )}
                {hasEvaluatorRole && (
                  <Typography variant="body2" color="text.secondary">
                    • En tant qu'<strong>Évaluateur</strong>, vous évaluez les manuscrits soumis.
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Activity sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Activité récente
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vos dernières actions apparaîtront ici.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </RoleGuard>
  );
}
