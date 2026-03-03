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
  HourglassEmpty,
} from '@mui/icons-material';
import Link from 'next/link';
import { publicApiService, ActiveTheme } from '@/services/publicApiService';

// ─── Design tokens (identiques à la page About) ───
const TOKEN = {
  black: '#0a0a0a',
  white: '#ffffff',
  offWhite: '#f5f4f0',
  gray100: '#f0efeb',
  gray300: '#d4d2cc',
  gray500: '#8a887f',
  gray700: '#3d3c38',
  gold: '#b8953a',
  goldLight: '#f5e9cc',
  goldDim: 'rgba(184,149,58,0.08)',
};

const fontSans = '"Noto Sans", sans-serif';

// ─── AppelCard ───
function AppelCard({ theme, index }: { theme: ActiveTheme; index: number }) {
  const [mounted, setMounted] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    if (theme.date_limite) {
      const deadline = new Date(theme.date_limite);
      const days = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      setDaysLeft(days);
      setFormattedDate(
        deadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      );
    }
  }, [theme.date_limite]);

  const isUrgent = daysLeft !== null && daysLeft <= 7;

  if (!mounted) {
    return (
      <Card
        elevation={0}
        sx={{
          height: '100%',
          border: `1px solid ${TOKEN.gray300}`,
          borderRadius: 2,
          bgcolor: TOKEN.white,
        }}
      >
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mt: 2 }} />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="rectangular" height={40} sx={{ mt: 3, borderRadius: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: `1px solid`,
        borderColor: isUrgent ? TOKEN.gold : TOKEN.gray300,
        borderRadius: 2,
        bgcolor: TOKEN.white,
        transition: 'all 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: TOKEN.black,
          boxShadow: `0 12px 32px rgba(0,0,0,0.08)`,
        },
        // Subtle top accent bar on hover
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          bgcolor: isUrgent ? TOKEN.gold : TOKEN.black,
          opacity: 0,
          transition: 'opacity 0.25s ease',
        },
        '&:hover::before': {
          opacity: 1,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 3.5 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Index + Urgency row */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontFamily: fontSans,
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: TOKEN.gray500,
              textTransform: 'uppercase',
            }}
          >
            Appel n° {String(index + 1).padStart(2, '0')}
          </Typography>

          {isUrgent && daysLeft !== null && (
            <Chip
              size="small"
              icon={<HourglassEmpty sx={{ fontSize: '12px !important' }} />}
              label={`${daysLeft}j restant${daysLeft > 1 ? 's' : ''}`}
              sx={{
                fontFamily: fontSans,
                fontSize: '0.7rem',
                fontWeight: 700,
                bgcolor: TOKEN.gold,
                color: TOKEN.white,
                height: 22,
                '& .MuiChip-icon': { color: TOKEN.white },
              }}
            />
          )}
        </Stack>

        {/* Title */}
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
          sx={{
            fontFamily: fontSans,
            fontSize: { xs: '0.95rem', md: '1rem' },
            letterSpacing: '-0.01em',
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: TOKEN.black,
          }}
        >
          {theme.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            fontFamily: fontSans,
            color: TOKEN.gray500,
            lineHeight: 1.75,
            fontSize: '0.875rem',
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

        <Divider sx={{ borderColor: TOKEN.gray100, mb: 2 }} />

        {/* Deadline */}
        {formattedDate && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
            <Schedule
              sx={{
                fontSize: 15,
                color: isUrgent ? TOKEN.gold : TOKEN.gray500,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontFamily: fontSans,
                fontSize: '0.8rem',
                fontWeight: isUrgent ? 600 : 400,
                color: isUrgent ? TOKEN.gold : TOKEN.gray500,
              }}
            >
              Limite : {formattedDate}
            </Typography>
          </Stack>
        )}

        {/* CTA */}
        <Link href="/register" style={{ textDecoration: 'none' }}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              fontFamily: fontSans,
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              bgcolor: TOKEN.black,
              color: TOKEN.white,
              borderRadius: 1,
              py: 1.2,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: TOKEN.gold,
                boxShadow: 'none',
              },
              transition: 'background 0.2s ease',
            }}
          >
            Soumettre un manuscrit
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// ─── Page ───
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
    <Box sx={{ bgcolor: TOKEN.offWhite, minHeight: 'calc(100vh - 200px)' }}>

      {/* ─── HERO ─── */}
      <Box
        sx={{
          bgcolor: TOKEN.black,
          color: TOKEN.white,
          py: { xs: 7, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.03) 40px)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-60px',
            right: '-80px',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${TOKEN.gold}22 0%, transparent 70%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{ mb: 3 }}
            >
              <TrendingUp sx={{ fontSize: 16, color: TOKEN.gold }} />
              <Typography
                sx={{
                  fontFamily: fontSans,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: TOKEN.gold,
                }}
              >
                Appels à contribution
              </Typography>
            </Stack>

            <Box sx={{ width: 48, height: 2, bgcolor: TOKEN.gold, mx: 'auto', mb: 3, borderRadius: 1 }} />

            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                fontFamily: fontSans,
                fontSize: { xs: '2rem', md: '2.8rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              Appels Ouverts aux Soumissions
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontFamily: fontSans,
                fontWeight: 300,
                color: TOKEN.gray300,
                maxWidth: 620,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.7,
              }}
            >
              Vous avez des travaux de recherche à partager ?{' '}
              Ces thématiques n&apos;attendent que vos contributions.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ─── CONTENT ─── */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>

        {loading ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Box key={i} sx={{ flex: { xs: '1 1 100%', lg: '0 0 calc(25% - 18px)' } }}>
                <Skeleton
                  variant="rectangular"
                  height={280}
                  sx={{ borderRadius: 2, bgcolor: TOKEN.gray300 }}
                />
              </Box>
            ))}
          </Box>
        ) : themes.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 6, md: 10 },
              textAlign: 'center',
              border: `1px dashed ${TOKEN.gray300}`,
              borderRadius: 2,
              bgcolor: TOKEN.white,
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: TOKEN.gray100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Schedule sx={{ fontSize: 32, color: TOKEN.gray500 }} />
            </Box>

            <Typography
              variant="h5"
              fontWeight={700}
              gutterBottom
              sx={{ fontFamily: fontSans, letterSpacing: '-0.01em' }}
            >
              Aucun appel disponible
            </Typography>
            <Typography
              sx={{
                fontFamily: fontSans,
                color: TOKEN.gray500,
                maxWidth: 460,
                mx: 'auto',
                lineHeight: 1.75,
                fontSize: '0.95rem',
              }}
            >
              Il n&apos;y a pas d&apos;appel ouvert aux soumissions pour le moment.
              Revenez bientôt pour découvrir les nouvelles opportunités.
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Count label */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
              <Typography
                sx={{
                  fontFamily: fontSans,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: TOKEN.gray500,
                }}
              >
                {themes.length} appel{themes.length > 1 ? 's' : ''} ouvert{themes.length > 1 ? 's' : ''}
              </Typography>
              <Box sx={{ flex: 1, height: 1, bgcolor: TOKEN.gray300, mx: 3 }} />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {themes.map((theme, index) => (
                <Box key={theme.id} sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)', lg: '0 0 calc(25% - 18px)' } }}>
                  <AppelCard theme={theme} index={index} />
                </Box>
              ))}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}