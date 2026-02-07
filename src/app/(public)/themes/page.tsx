'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Skeleton,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import {
  Schedule,
  TrendingUp,
} from '@mui/icons-material';
import Link from 'next/link';
import { publicApiService, ActiveTheme } from '@/services/publicApiService';

// Composant ThemeCard identique à celui de la page d'accueil
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

export default function ThemesPage() {
  const [themes, setThemes] = useState<ActiveTheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const data = await publicApiService.getActiveThemes();
        setThemes(data);
      } catch (error) {
        console.error('Error fetching themes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  return (
    <Box sx={{ py: 6 }}>
      {/* Header Section - Same style as homepage */}
      <Container maxWidth="xl">
        <Box textAlign="center" sx={{ mb: 5 }}>
          <Chip 
            icon={<TrendingUp />} 
            label="Appels à contribution" 
            sx={{ 
              mb: 2,
              bgcolor: '#ff9d00',
              color: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Appels Ouverts aux Soumissions
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Vous avez des travaux de recherche à partager ? Ces thématiques n&apos;attendent que vos contributions !
          </Typography>
        </Box>

        {/* Themes Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Box key={i} sx={{ flex: { xs: '1 1 100%', lg: '0 0 calc(25% - 18px)' } }}>
                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 3 }} />
              </Box>
            ))}
          </Box>
        ) : themes.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: 'center',
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 3,
              bgcolor: 'white',
            }}
          >
            <Schedule sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Aucun appel disponible
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
              Il n&apos;y a pas d'appel ouvert aux soumissions pour le moment.
              Revenez bientôt pour découvrir les nouvelles opportunités.
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {themes.map((theme) => (
              <Box key={theme.id} sx={{ flex: { xs: '1 1 100%', lg: '0 0 calc(25% - 18px)' } }}>
                <ThemeCard theme={theme} />
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
