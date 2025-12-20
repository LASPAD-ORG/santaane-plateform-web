'use client';

import { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArticleIcon from '@mui/icons-material/Article';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PeopleIcon from '@mui/icons-material/People';
import { useFetchStatistics } from './fetchers/useFetchStatistics';

export default function RapportsPage() {
  const { data: stats, loading, fetch } = useFetchStatistics();

  useEffect(() => {
    fetch();
  }, []);

  if (loading) {
    return (
      <Typography variant="body1" color="text.secondary">
        Chargement...
      </Typography>
    );
  }

  if (!stats) return null;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Rapports et Statistiques
        </Typography>
        <Button variant="contained" startIcon={<DownloadIcon />}>
          Exporter en PDF
        </Button>
      </Stack>

      {/* Statistiques globales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <ArticleIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.totalManuscripts}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manuscrits totaux
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.manuscriptsThisMonth}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ce mois-ci
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <RateReviewIcon color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.reviewsCompleted}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Évaluations complétées
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <PeopleIcon color="secondary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.activeResearchers}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chercheurs actifs
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Manuscrits par statut */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Manuscrits par statut
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                {stats.manuscriptsByStatus.map((item: any) => (
                  <Stack
                    key={item.status}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body1">{item.label}</Typography>
                    <Typography variant="h6" color="primary">
                      {item.count}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance des évaluateurs
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                {stats.topReviewers.map((reviewer: any) => (
                  <Stack
                    key={reviewer.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body1">{reviewer.name}</Typography>
                    <Typography variant="h6" color="info.main">
                      {reviewer.reviewCount} évaluations
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Temps moyens */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Temps moyen de révision
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h3" color="primary">
                {stats.averageReviewTime}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                jours
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Taux d&apos;acceptation
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h3" color="success.main">
                {stats.acceptanceRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                des manuscrits
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Taux de rejet
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h3" color="error.main">
                {stats.rejectionRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                des manuscrits
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
