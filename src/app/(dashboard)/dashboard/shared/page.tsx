'use client';

import { Box, Typography, Card, CardContent, Paper, Grid, Chip, Button, Avatar, LinearProgress, Skeleton } from '@mui/material';
import {
  Article as ArticleIcon,
  Create as CreateIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Forum as ForumIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import { getRoleLabel, getRoleColor } from '@/config/roles';
import { useMentorStats, type ActivityItem } from './hooks/useMentorStats';
import { formatDernierContact, getPrioriteColor } from '../mentor/auteur-a-acompagner/helpers/formatters';
import { useRouter } from 'next/navigation';

export default function SharedDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { stats: mentorStats, loading: mentorStatsLoading } = useMentorStats();

  // Determine what features to show based on user roles
  const hasAuthorRole = user?.roles.includes(UserRole.AUTHOR);
  const hasMentorRole = user?.roles.includes(UserRole.MENTOR);
  const hasEvaluatorRole = user?.roles.includes(UserRole.EVALUATOR);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'notification':
        return <NotificationsIcon />;
      case 'validation_terminee':
        return <CheckCircleIcon />;
      case 'echange_nouveau':
        return <ForumIcon />;
      case 'manuscrit_recu':
        return <DescriptionIcon />;
      case 'commentaire_ajoute':
        return <CreateIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'notification':
        return 'primary.main';
      case 'validation_terminee':
        return 'success.main';
      case 'echange_nouveau':
        return 'info.main';
      case 'manuscrit_recu':
        return 'secondary.main';
      case 'commentaire_ajoute':
        return 'warning.main';
      default:
        return 'grey.500';
    }
  };

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
              {/* Auteurs accompagnés */}
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                  }}
                  onClick={() => router.push('/dashboard/mentor/auteur-a-acompagner')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                      <Box>
                        <Typography variant="h4">
                          {mentorStatsLoading ? (
                            <Skeleton width={40} />
                          ) : (
                            mentorStats?.auteursAccompagnes || 0
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Auteurs accompagnés
                        </Typography>
                      </Box>
                    </Box>
                    {!mentorStatsLoading && mentorStats && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LaunchIcon sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">
                          Voir tous
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Manuscrits en cours */}
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                      <Box>
                        <Typography variant="h4">
                          {mentorStatsLoading ? (
                            <Skeleton width={40} />
                          ) : (
                            mentorStats?.manuscritsEnCours || 0
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Manuscrits en cours
                        </Typography>
                      </Box>
                    </Box>
                    {!mentorStatsLoading && mentorStats && (
                      <LinearProgress 
                        variant="determinate" 
                        value={mentorStats.manuscritsEnCours > 0 ? 
                          (mentorStats.manuscritsValides / (mentorStats.manuscritsEnCours + mentorStats.manuscritsValides)) * 100 : 0
                        }
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Échanges non lus */}
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ForumIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                      <Box>
                        <Typography variant="h4">
                          {mentorStatsLoading ? (
                            <Skeleton width={40} />
                          ) : (
                            mentorStats?.echangesNonLus || 0
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Échanges non lus
                        </Typography>
                      </Box>
                    </Box>
                    {!mentorStatsLoading && mentorStats && mentorStats.echangesNonLus > 0 && (
                      <Chip 
                        label="Action requise" 
                        color="error" 
                        size="small" 
                        sx={{ mt: 1 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Taux de validation */}
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                      <Box>
                        <Typography variant="h4">
                          {mentorStatsLoading ? (
                            <Skeleton width={40} />
                          ) : (
                            `${mentorStats?.tauxValidation || 0}%`
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Taux de validation
                        </Typography>
                      </Box>
                    </Box>
                    {!mentorStatsLoading && mentorStats && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        {mentorStats.statistiquesDetaillees.tendances.manuscritsCeMois >= 
                         mentorStats.statistiquesDetaillees.tendances.manuscritsMoisPrecedent ? (
                          <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                        ) : (
                          <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                        )}
                        <Typography variant="caption" color="text.secondary">
                          vs mois précédent
                        </Typography>
                      </Box>
                    )}
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
                {hasMentorRole ? 'Statistiques de mentorat' : 'Aperçu de vos activités'}
              </Typography>

              {hasMentorRole && mentorStats && !mentorStatsLoading ? (
                <Box>
                  {/* Graphiques et statistiques détaillées */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Répartition par statut */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                            Manuscrits par statut
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {Object.entries(mentorStats.statistiquesDetaillees.parStatut).map(([statut, count]) => (
                              <Box key={statut} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                  {statut.replace('_', ' ')}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={(count / Math.max(Object.values(mentorStats.statistiquesDetaillees.parStatut).reduce((a, b) => a + b, 0), 1)) * 100}
                                    sx={{ width: 60, height: 4 }}
                                  />
                                  <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 20 }}>
                                    {count}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* État des validations */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                            État des validations
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {Object.entries(mentorStats.statistiquesDetaillees.parValidation).map(([etat, count]) => (
                              <Box key={etat} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                  {etat.replace('_', ' ')}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={(count / Math.max(Object.values(mentorStats.statistiquesDetaillees.parValidation).reduce((a, b) => a + b, 0), 1)) * 100}
                                    sx={{ width: 60, height: 4 }}
                                    color={etat === 'valide' ? 'success' : etat === 'en_cours' ? 'primary' : 'warning'}
                                  />
                                  <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 20 }}>
                                    {count}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Actions rapides */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Actions rapides
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        startIcon={<PersonIcon />}
                        onClick={() => router.push('/dashboard/mentor/auteur-a-acompagner')}
                        color="secondary"
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                      >
                        Gérer mes auteurs
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<DescriptionIcon />}
                        onClick={() => router.push('/dashboard/shared/author/gestion-manuscrit')}
                        color="primary"
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                      >
                        Tous les manuscrits
                      </Button>
                    </Box>
                  </Box>

                  {/* Tendances */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Tendances ce mois
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {mentorStats.statistiquesDetaillees.tendances.manuscritsCeMois}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Manuscrits ce mois
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 0.5 }}>
                            {mentorStats.statistiquesDetaillees.tendances.manuscritsCeMois >= 
                             mentorStats.statistiquesDetaillees.tendances.manuscritsMoisPrecedent ? (
                              <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                            ) : (
                              <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                            )}
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.light', borderRadius: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {mentorStats.statistiquesDetaillees.tendances.echangesCeMois}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Échanges ce mois
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 0.5 }}>
                            {mentorStats.statistiquesDetaillees.tendances.echangesCeMois >= 
                             mentorStats.statistiquesDetaillees.tendances.echangesMoisPrecedent ? (
                              <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                            ) : (
                              <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                            )}
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {mentorStats.manuscritsValides}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Manuscrits validés
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {mentorStats.tauxValidation}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Taux de réussite
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              ) : hasMentorRole && mentorStatsLoading ? (
                <Box>
                  <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
                  <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
                </Box>
              ) : (
                <Box>
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
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Activity sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Activité récente
              </Typography>

              {hasMentorRole && mentorStats && !mentorStatsLoading ? (
                <Box>
                  {mentorStats.activiteRecente.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {mentorStats.activiteRecente.slice(0, 3).map((activity) => (
                        <Card key={activity.id} variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar 
                              sx={{ 
                                width: 32, 
                                height: 32, 
                                bgcolor: getActivityColor(activity.type),
                                fontSize: '1rem'
                              }}
                            >
                              {getActivityIcon(activity.type)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                  {activity.titre}
                                </Typography>
                                {activity.priorite && (
                                  <Chip 
                                    size="small" 
                                    label={activity.priorite} 
                                    color={getPrioriteColor(activity.priorite)}
                                    sx={{ height: 16, fontSize: '0.65rem' }}
                                  />
                                )}
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 1, lineHeight: 1.3 }}>
                                {activity.description}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="caption" color="text.secondary">
                                  {activity.auteurNom && (
                                    <Box component="span" sx={{ fontWeight: 600 }}>
                                      {activity.auteurNom}
                                    </Box>
                                  )}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDernierContact(activity.date)}
                                </Typography>
                              </Box>
                              {activity.manuscritTitre && (
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontStyle: 'italic' }}>
                                  📄 {activity.manuscritTitre}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Card>
                      ))}
                      {mentorStats.activiteRecente.length > 3 && (
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => router.push('/dashboard/mentor/auteur-a-acompagner')}
                          sx={{ 
                            alignSelf: 'center',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            mt: 1
                          }}
                        >
                          Voir plus d'activités ({mentorStats.activiteRecente.length - 3})
                        </Button>
                      )}
                    </Box>
                  ) : (
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        bgcolor: 'grey.50',
                        border: '1px dashed',
                        borderColor: 'grey.300'
                      }}
                    >
                      <ScheduleIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Aucune activité récente
                      </Typography>
                    </Paper>
                  )}

                  {/* Résumé des priorités */}
                  {(mentorStats.notificationsNonLues > 0 || mentorStats.echangesNonLus > 0 || mentorStats.manuscritsEnAttente > 0) && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                        Actions prioritaires
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {mentorStats.notificationsNonLues > 0 && (
                          <Card sx={{ bgcolor: 'error.light', border: '1px solid', borderColor: 'error.main' }}>
                            <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <NotificationsIcon sx={{ fontSize: 18, color: 'error.main' }} />
                                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                    {mentorStats.notificationsNonLues} notification{mentorStats.notificationsNonLues > 1 ? 's' : ''}
                                  </Typography>
                                </Box>
                                <Button 
                                  size="small" 
                                  variant="contained" 
                                  color="error" 
                                  sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem' }}
                                  onClick={() => router.push('/dashboard/mentor/auteur-a-acompagner')}
                                >
                                  Voir
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        )}

                        {mentorStats.echangesNonLus > 0 && (
                          <Card sx={{ bgcolor: 'warning.light', border: '1px solid', borderColor: 'warning.main' }}>
                            <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <ForumIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                    {mentorStats.echangesNonLus} échange{mentorStats.echangesNonLus > 1 ? 's' : ''}
                                  </Typography>
                                </Box>
                                <Button 
                                  size="small" 
                                  variant="contained" 
                                  color="warning" 
                                  sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem' }}
                                  onClick={() => router.push('/dashboard/mentor/auteur-a-acompagner')}
                                >
                                  Consulter
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        )}

                        {mentorStats.manuscritsEnAttente > 0 && (
                          <Card sx={{ bgcolor: 'info.light', border: '1px solid', borderColor: 'info.main' }}>
                            <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <ScheduleIcon sx={{ fontSize: 18, color: 'info.main' }} />
                                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                    {mentorStats.manuscritsEnAttente} à valider
                                  </Typography>
                                </Box>
                                <Button 
                                  size="small" 
                                  variant="contained" 
                                  color="info" 
                                  sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem' }}
                                  onClick={() => router.push('/dashboard/mentor/auteur-a-acompagner')}
                                >
                                  Valider
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : hasMentorRole && mentorStatsLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[1, 2, 3, 4].map((item) => (
                    <Skeleton key={item} variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Vos dernières actions apparaîtront ici.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </RoleGuard>
  );
}
