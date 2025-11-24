'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  Skeleton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useFetchAuteurAAcompagnerById, type AuteurAAcompagnerItem } from '../../fetchers/useFetchAuteurAAcompagner';
import EchangeTimeline from '../../components/EchangeTimeline';
import NotificationCenter from '../../components/NotificationCenter';
import {
  getAuteurFullName,
  formatAuteurAAcompagnerDate
} from '../../helpers/formatters';

export default function EchangesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: auteur, loading, fetch } = useFetchAuteurAAcompagnerById();

  useEffect(() => {
    if (id) {
      fetch(id);
    }
  }, [id]);

  const handleBack = () => {
    router.push(`/dashboard/mentor/auteur-a-acompagner/${id}`);
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    // En production, faire un appel API
    console.log('Marking notification as read:', notificationId);
  };

  const handleMarkAllNotificationsAsRead = () => {
    // En production, faire un appel API
    console.log('Marking all notifications as read');
  };

  // Loading state
  if (loading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" sx={{ fontSize: '2rem', width: '50%', mb: 1 }} />
            <Skeleton variant="text" width={300} />
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
              ))}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2].map((item) => (
                <Skeleton key={item} variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
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
          Impossible de charger les échanges pour cet auteur.
        </Typography>
        <IconButton
          onClick={handleBack}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { bgcolor: 'grey.100' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Échanges - {getAuteurFullName(auteur.prenom, auteur.nom)}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Suivi des interactions avec les éditeurs
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Timeline des échanges */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined" sx={{ height: 'fit-content' }}>
            <CardContent>
              <EchangeTimeline
                echanges={auteur.echanges}
                manuscrits={auteur.manuscrits}
                loading={loading}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar with notifications and stats */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Notifications */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <NotificationCenter
                notifications={auteur.notifications}
                loading={loading}
                onMarkAsRead={handleMarkNotificationAsRead}
                onMarkAllAsRead={handleMarkAllNotificationsAsRead}
              />
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Statistiques
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total échanges
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {auteur.statistiques?.totalEchanges || 0}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Échanges non lus
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: auteur.statistiques?.echangesNonLus ? 'error.main' : 'text.primary'
                    }}
                  >
                    {auteur.statistiques?.echangesNonLus || 0}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Manuscrits en attente
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {auteur.statistiques?.manuscritsEnAttente || 0}
                  </Typography>
                </Box>

                {auteur.statistiques?.dernierEchange && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Dernier échange
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatAuteurAAcompagnerDate(auteur.statistiques.dernierEchange).split(' ')[0]}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}