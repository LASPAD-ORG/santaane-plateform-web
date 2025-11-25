'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  Comment as CommentIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Forum as ForumIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useFetchAuteurAAcompagnerById, type AuteurAAcompagnerItem, type ManuscritAuteur } from '../fetchers/useFetchAuteurAAcompagner';
import EchangeTimeline from '../components/EchangeTimeline';
import NotificationCenter from '../components/NotificationCenter';
import {
  formatAuteurAAcompagnerDate,
  getStatusLabel,
  getStatusColor,
  getAuteurFullName,
  getAuteurInitials,
  formatDernierContact,
  getManuscritStatusLabel,
  getManuscritStatusColor,
  getValidationStatusLabel,
  getValidationStatusColor,
  truncateContent
} from '../helpers/formatters';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auteur-tabpanel-${index}`}
      aria-labelledby={`auteur-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function AuteurDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: auteur, loading, fetch } = useFetchAuteurAAcompagnerById();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (id) {
      fetch(id);
    }
  }, [id]);

  const handleBack = () => {
    router.push('/dashboard/mentor/auteur-a-acompagner');
  };

  const handleViewManuscrit = (manuscrit: ManuscritAuteur) => {
    // Navigate to manuscrit detail using the shared route
    router.push(`/dashboard/shared/author/gestion-manuscrit/${manuscrit.id}`);
  };

  const handleEditManuscrit = (manuscrit: ManuscritAuteur) => {
    // Navigate to manuscrit edit
    router.push(`/dashboard/shared/author/gestion-manuscrit/${manuscrit.id}/edit`);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    // En production, faire un appel API
    console.log('Marking notification as read:', notificationId);
  };

  const handleMarkAllNotificationsAsRead = () => {
    // En production, faire un appel API
    console.log('Marking all notifications a s read');
  };

  const tabs = [
    {
      key: 'profil',
      label: 'Profil',
      icon: PersonIcon,
      count: 0
    },
    {
      key: 'manuscrits',
      label: 'Manuscrits',
      icon: DescriptionIcon,
      count: auteur?.manuscrits.length || 0
    },
    {
      key: 'echanges',
      label: 'Échanges',
      icon: ForumIcon,
      count: auteur?.statistiques?.echangesNonLus || 0
    },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: NotificationsIcon,
      count: auteur?.notifications.filter(n => !n.lu).length || 0
    }
  ];

  const formatManuscritDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" sx={{ fontSize: '2rem', width: '40%', mb: 1 }} />
            <Skeleton variant="text" width={200} />
          </Box>
        </Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // Error state
  if (!auteur) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <PersonIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Auteur non trouvé
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          L'auteur demandé n'existe pas ou n'est plus disponible.
        </Typography>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBack} color="primary">
          Retour à la liste
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Header moderne */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={handleBack}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              mr: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Profil Auteur
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'rgba(255,255,255,0.2)',
              fontSize: '2rem',
              fontWeight: 700,
              border: '3px solid rgba(255,255,255,0.3)'
            }}
          >
            {auteur.avatar || getAuteurInitials(auteur.prenom, auteur.nom)}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              {getAuteurFullName(auteur.prenom, auteur.nom)}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
              <Chip
                label={getStatusLabel(auteur.statut)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-label': { fontSize: '0.875rem' }
                }}
              />
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                📚 {auteur.nombreManuscrits} manuscrit{auteur.nombreManuscrits > 1 ? 's' : ''}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ opacity: 0.8, fontSize: '1rem' }}>
              📧 {auteur.email} • 📅 Dernier contact : {formatDernierContact(auteur.dernierContact)}
            </Typography>
          </Box>

          {/* Statistiques rapides */}
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'row', md: 'column' } }}>
            <Paper sx={{ p: 2, textAlign: 'center', minWidth: 100, bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {auteur.statistiques?.totalEchanges || 0}
              </Typography>
              <Typography variant="caption">Échanges</Typography>
            </Paper>
            <Paper sx={{ p: 2, textAlign: 'center', minWidth: 100, bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: auteur.statistiques?.echangesNonLus ? 'warning.light' : 'inherit' }}>
                {auteur.statistiques?.echangesNonLus || 0}
              </Typography>
              <Typography variant="caption">Non lus</Typography>
            </Paper>
          </Box>
        </Box>
      </Paper>

      {/* Navigation moderne avec cartes */}
      <Grid container spacing={2} sx={{ mb: 4, justifyContent: 'center' }}>
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === index;
          const isProfile = tab.key === 'profil';

          return (
            <Grid key={tab.key} size={{ xs: 6, sm: 4, md: 2.4 }}>
              <Paper
                onClick={() => setActiveTab(index)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  border: isActive ? 2 : 1,
                  borderColor: isActive ? 'primary.main' : 'divider',
                  bgcolor: isActive ? 'primary.50' : 'background.paper',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2
                  }
                }}
              >
                {isProfile ? (
                  <Icon
                    sx={{
                      fontSize: 40,
                      color: isActive ? 'primary.main' : 'text.secondary',
                      mb: 1
                    }}
                  />
                ) : (
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: isActive ? 'primary.main' : 'text.primary',
                      mb: 0.5,
                      lineHeight: 1
                    }}
                  >
                    {tab.count}
                  </Typography>
                )}

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    mt: isProfile ? 0 : 1
                  }}
                >
                  {tab.label}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          {/* Informations de base - Version simplifiée */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <PersonIcon color="primary" />
                  Informations
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                      Email
                    </Typography>
                    <Typography variant="body1">{auteur.email}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                      Inscription
                    </Typography>
                    <Typography variant="body1">{formatAuteurAAcompagnerDate(auteur.dateInscription)}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                      Statut
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={getStatusLabel(auteur.statut)}
                        color={getStatusColor(auteur.statut)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </Box>

                {auteur.specialites && auteur.specialites.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, mb: 2, display: 'block' }}>
                      Spécialités
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {auteur.specialites.map((specialite, index) => (
                        <Chip
                          key={index}
                          label={specialite}
                          variant="outlined"
                          size="small"
                          color="secondary"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Statistiques d'activité */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  📊 Activité
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {auteur.manuscrits.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Manuscrits
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {auteur.manuscrits.filter(m => m.statut === 'publie').length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Publiés
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                        {auteur.manuscrits.filter(m => m.statut === 'en_attente').length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        En attente
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                        {auteur.manuscrits.filter(m => m.statut === 'brouillon').length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Brouillons
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Aperçu des manuscrits */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <DescriptionIcon color="primary" />
                  Aperçu des Manuscrits ({auteur.manuscrits.length})
                </Typography>

                {auteur.manuscrits.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <DescriptionIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Aucun manuscrit
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cet auteur n'a pas encore soumis de manuscrit.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {auteur.manuscrits.slice(0, 3).map((manuscrit) => (
                      <Paper
                        key={manuscrit.id}
                        variant="outlined"
                        sx={{ p: 2, borderRadius: 2, '&:hover': { bgcolor: 'grey.50' } }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {manuscrit.titre}
                          </Typography>
                          <Chip
                            label={getManuscritStatusLabel(manuscrit.statut)}
                            color={getManuscritStatusColor(manuscrit.statut)}
                            size="small"
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {truncateContent(manuscrit.description, 100)}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            💬 {manuscrit.nombreCommentaires} commentaires
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            📅 {formatManuscritDate(manuscrit.dateMiseAJour)}
                          </Typography>
                          <Button
                            size="small"
                            onClick={() => handleViewManuscrit(manuscrit)}
                            sx={{ ml: 'auto', textTransform: 'none' }}
                          >
                            Voir →
                          </Button>
                        </Box>
                      </Paper>
                    ))}

                    {auteur.manuscrits.length > 3 && (
                      <Button
                        variant="outlined"
                        onClick={() => setActiveTab(1)}
                        sx={{ mt: 2, textTransform: 'none' }}
                      >
                        Voir tous les manuscrits ({auteur.manuscrits.length})
                      </Button>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Manuscrits Tab */}
      <TabPanel value={activeTab} index={1}>
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Manuscrits ({auteur.manuscrits.length})
          </Typography>

          {auteur.manuscrits.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: 'grey.50',
                border: '1px dashed',
                borderColor: 'grey.300'
              }}
            >
              <DescriptionIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Aucun manuscrit
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cet auteur n'a pas encore soumis de manuscrit.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {auteur.manuscrits.map((manuscrit) => (
                <Grid key={manuscrit.id} size={{ xs: 12, md: 6 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, flexGrow: 1, mr: 2 }}>
                          {manuscrit.titre}
                        </Typography>
                        <Chip
                          label={getManuscritStatusLabel(manuscrit.statut)}
                          color={getManuscritStatusColor(manuscrit.statut)}
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                        {truncateContent(manuscrit.description, 120)}
                      </Typography>



                      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', fontSize: '0.875rem' }}>
                        <Typography variant="caption" color="text.secondary">
                          📊 {manuscrit.nombreCommentaires} commentaires
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          📅 {formatManuscritDate(manuscrit.dateCreation)}
                        </Typography>
                      </Box>

                      {manuscrit.dernierCommentaire && (
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            bgcolor: 'grey.50',
                            borderLeft: 3,
                            borderLeftColor: 'secondary.main'
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                            Dernier commentaire :
                          </Typography>
                          <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '0.875rem' }}>
                            "{truncateContent(manuscrit.dernierCommentaire, 80)}"
                          </Typography>
                        </Paper>
                      )}
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewManuscrit(manuscrit)}
                        color="secondary"
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Voir
                      </Button>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditManuscrit(manuscrit)}
                        color="primary"
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Commenter
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </TabPanel>

      {/* Échanges Tab */}
      <TabPanel value={activeTab} index={2}>
        <EchangeTimeline
          echanges={auteur.echanges}
          manuscrits={auteur.manuscrits}
          loading={loading}
        />
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={activeTab} index={3}>
        <NotificationCenter
          notifications={auteur.notifications}
          loading={loading}
          onMarkAsRead={handleMarkNotificationAsRead}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        />
      </TabPanel>

    </Box>
  );
}