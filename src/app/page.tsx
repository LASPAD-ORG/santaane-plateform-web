'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Grid,
  Chip,
  Stack,
  Skeleton,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import {
  Search,
  Article,
  Person,
  Category,
  ArrowForward,
  CalendarMonth,
  Login,
  Schedule,
  TrendingUp,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { publicApiService, PublicManuscriptSummary, PublicStats, ActiveTheme } from '@/services/publicApiService';

// Composant ThemeCard pour éviter l'erreur d'hydratation avec Date.now()
function ThemeCard({ theme }: { theme: ActiveTheme }) {
  const [mounted, setMounted] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    if (theme.date_limite) {
      const deadline = new Date(theme.date_limite);
      const days = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      setDaysLeft(days);
      setFormattedDate(deadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }));
    }
  }, [theme.date_limite]);

  const isUrgent = daysLeft !== null && daysLeft <= 7;

  // Ne pas afficher tant que le composant n'est pas monté côté client
  if (!mounted) {
    return (
      <Card
        elevation={0}
        sx={{
          height: '100%',
          border: '2px solid',
          borderColor: 'divider',
          borderRadius: 3,
          bgcolor: 'white',
        }}
      >
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mt: 2 }} />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="rectangular" height={40} sx={{ mt: 3, borderRadius: 2 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: '2px solid',
        borderColor: isUrgent ? '#ff9d00' : 'divider',
        borderRadius: 3,
        bgcolor: 'white',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(255, 157, 0, 0.2)',
        },
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Urgency badge */}
        {isUrgent && daysLeft !== null && (
          <Chip
            size="small"
            label={`Plus que ${daysLeft} jour${daysLeft > 1 ? 's' : ''} !`}
            color="error"
            sx={{ alignSelf: 'flex-start', mb: 2, fontWeight: 600 }}
          />
        )}

        {/* Title */}
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {theme.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 3,
            flex: 1,
          }}
        >
          {theme.description || 'Aucune description disponible'}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Deadline */}
        {formattedDate && (
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Schedule sx={{ fontSize: 18, color: isUrgent ? 'error.main' : 'text.secondary' }} />
              <Typography 
                variant="body2" 
                fontWeight={isUrgent ? 600 : 400}
                color={isUrgent ? 'error.main' : 'text.secondary'}
              >
                Date limite: {formattedDate}
              </Typography>
            </Stack>
          </Stack>
        )}

        {/* CTA */}
        <Link href="/register" style={{ textDecoration: 'none', marginTop: 16 }}>
          <Button
            fullWidth
            variant="contained"
            sx={{ 
              borderRadius: 2, 
              fontWeight: 600,
              bgcolor: '#ff9d00',
              '&:hover': { bgcolor: '#e68a00' }
            }}
          >
            Soumettre un manuscrit
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentManuscripts, setRecentManuscripts] = useState<PublicManuscriptSummary[]>([]);
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [activeThemes, setActiveThemes] = useState<ActiveTheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [manuscripts, statsData, themes] = await Promise.all([
          publicApiService.getRecentPublications(6),
          publicApiService.getStats(),
          publicApiService.getActiveThemes(),
        ]);
        setRecentManuscripts(manuscripts);
        setStats(statsData);
        setActiveThemes(themes);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/manuscripts?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/manuscripts');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fafafa' }}>
      {/* Header */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'white', 
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/images/logo_santaane.png" alt="Santaane" style={{ height: 100, padding: 10 }} />
            </Link>
            
            <Stack direction="row" spacing={2}>
              <Link href="/manuscripts" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ color: 'text.secondary' }}>
                  Publications
                </Button>
              </Link>
              <Link href="/themes" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ color: 'text.secondary' }}>
                  Thèmes Ouverts
                </Button>
              </Link>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Login />}
                  sx={{ 
                    borderRadius: 2,
                    borderColor: '#59a498',
                    color: '#59a498',
                    '&:hover': {
                      borderColor: '#59a498',
                      bgcolor: 'rgba(89, 164, 152, 0.08)',
                    }
                  }}
                >
                  Connexion
                </Button>
              </Link>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #59a498 0%, #ff9d00 100%)',
            color: 'white',
            py: { xs: 8, md: 12 },
          }}
        >
          <Container maxWidth="lg">
            <Box textAlign="center" mb={6}>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
              >
                Découvrez les Publications Scientifiques
              </Typography>
              <Typography
                variant="h6"
                sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto', mb: 4 }}
              >
                Accédez à une collection de manuscrits scientifiques évalués par des pairs
              </Typography>

              {/* Search Bar */}
              <Paper
                component="form"
                onSubmit={handleSearch}
                elevation={0}
                sx={{
                  maxWidth: 700,
                  mx: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Rechercher par titre, mots-clés, auteur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton type="submit" color="primary" size="large">
                            <ArrowForward />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      '& fieldset': { border: 'none' },
                    },
                  }}
                />
              </Paper>
            </Box>
          </Container>
        </Box>

        {/* Recent Publications */}
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <Typography variant="h5" fontWeight="bold">
              Publications Récentes
            </Typography>
            <Link href="/manuscripts" style={{ textDecoration: 'none' }}>
              <Chip
                label="Voir tout"
                icon={<ArrowForward />}
                clickable
                sx={{
                  borderColor: '#59a498',
                  color: '#59a498',
                  '& .MuiChip-icon': { color: '#59a498' },
                  '&:hover': { bgcolor: 'rgba(89, 164, 152, 0.08)' }
                }}
                variant="outlined"
              />
            </Link>
          </Stack>

          {loading ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          ) : recentManuscripts.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Article sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography color="text.secondary">
                Aucune publication disponible pour le moment
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {recentManuscripts.map((manuscript) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={manuscript.id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#59a498',
                        boxShadow: '0 4px 20px rgba(89, 164, 152, 0.15)',
                      },
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      href={`/manuscripts/${manuscript.id}`}
                      sx={{ height: '100%' }}
                    >
                      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Theme & Section */}
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          {manuscript.themeName && (
                            <Chip
                              size="small"
                              label={manuscript.themeName}
                              icon={<Category sx={{ fontSize: 14 }} />}
                              sx={{ fontSize: 11 }}
                            />
                          )}
                          <Chip
                            size="small"
                            label={manuscript.sectionName}
                            variant="outlined"
                            sx={{ fontSize: 11 }}
                          />
                        </Stack>

                        {/* Title */}
                        <Typography
                          variant="subtitle1"
                          fontWeight="600"
                          gutterBottom
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4,
                          }}
                        >
                          {manuscript.title}
                        </Typography>

                        {/* Abstract */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 2,
                            flex: 1,
                          }}
                        >
                          {truncateText(manuscript.abstract, 150)}
                        </Typography>

                        {/* Keywords */}
                        {manuscript.keywords && (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
                            {manuscript.keywords.split(',').slice(0, 3).map((keyword, idx) => (
                              <Chip
                                key={idx}
                                label={keyword.trim()}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: 10, height: 22 }}
                              />
                            ))}
                          </Stack>
                        )}

                        <Divider sx={{ my: 1.5 }} />

                        {/* Author & Date */}
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {manuscript.authorName}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <CalendarMonth sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.disabled">
                              {formatDate(manuscript.publishedAt || manuscript.createdAt)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        {/* Active Themes Section */}
        {activeThemes.length > 0 && (
          <Box sx={{ bgcolor: '#fff7ed', py: 8 }}>
            <Container maxWidth="xl">
              <Box textAlign="center" sx={{ mb: 5 }}>
                <Chip 
                  icon={<TrendingUp />} 
                  label="Appels à contribution" 
                  color="warning" 
                  sx={{ mb: 2 }}
                />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Thèmes Ouverts aux Soumissions
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                  Vous avez des travaux de recherche à partager ? Ces thématiques n&apos;attendent que vos contributions !
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {activeThemes.map((theme) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={theme.id}>
                    <ThemeCard theme={theme} />
                  </Grid>
                ))}
              </Grid>

              <Box textAlign="center" sx={{ mt: 4 }}>
                <Link href="/themes" style={{ textDecoration: 'none' }}>
                  <Button 
                    variant="outlined" 
                    endIcon={<ArrowForward />}
                    sx={{ 
                      borderRadius: 2,
                      borderColor: '#ff9d00',
                      color: '#ff9d00',
                      '&:hover': {
                        borderColor: '#ff9d00',
                        bgcolor: 'rgba(255, 157, 0, 0.08)',
                      }
                    }}
                  >
                    Voir tous les thèmes
                  </Button>
                </Link>
              </Box>
            </Container>
          </Box>
        )}

        {/* Call to Action */}
        <Box sx={{ bgcolor: '#f8fafc', py: 8 }}>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Vous êtes chercheur ?
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Soumettez vos manuscrits et bénéficiez d&apos;une évaluation par des pairs experts
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Link href="/register" style={{ textDecoration: 'none' }}>
                <Chip
                  label="Créer un compte"
                  clickable
                  sx={{ 
                    px: 2, 
                    py: 2.5, 
                    fontSize: 14,
                    bgcolor: '#ff9d00',
                    color: 'white',
                    '&:hover': { bgcolor: '#e68a00' }
                  }}
                />
              </Link>
              <Link href="/manuscripts" style={{ textDecoration: 'none' }}>
                <Chip
                  label="Explorer les publications"
                  variant="outlined"
                  clickable
                  sx={{ px: 2, py: 2.5, fontSize: 14 }}
                />
              </Link>
            </Stack>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 4, 
          bgcolor: 'white', 
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="xl">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Santaane - Plateforme de publication scientifique
            </Typography>
            <Stack direction="row" spacing={3}>
              <Link href="/about" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: '#ff9d00' } }}>
                  À propos
                </Typography>
              </Link>
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: '#ff9d00' } }}>
                  Contact
                </Typography>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
