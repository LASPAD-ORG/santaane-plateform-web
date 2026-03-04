'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
} from '@mui/material';
import {
  Home,
  ArrowBack,
  Article,
  MenuBook,
  Search,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const TOKEN = {
  black: '#0a0a0a',
  white: '#ffffff',
  offWhite: '#f5f4f0',
  gray100: '#f0efeb',
  gray300: '#d4d2cc',
  gray500: '#8a887f',
  gray700: '#3d3c38',
  gold: '#b8953a',
  goldDim: 'rgba(184,149,58,0.08)',
};

const fontSans = '"Noto Sans", sans-serif';

export default function NotFound() {
  const router = useRouter();

  const quickLinks = [
    { label: 'Publications', path: '/manuscripts', icon: <Article sx={{ fontSize: 16 }} /> },
    { label: 'Appels ouverts', path: '/appels', icon: <MenuBook sx={{ fontSize: 16 }} /> },
    { label: 'Guide de soumission', path: '/guide-soumission', icon: <Search sx={{ fontSize: 16 }} /> },
    { label: 'Contact', path: '/contact', icon: null },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: TOKEN.offWhite,
        position: 'relative',
        overflow: 'hidden',
        py: 6,
        // Grid background
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.03) 40px)',
          pointerEvents: 'none',
        },
        // Gold halo bottom-left
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${TOKEN.gold}15 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${TOKEN.gray300}`,
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: TOKEN.white,
          }}
        >
          {/* Top accent */}
          <Box sx={{ height: 3, bgcolor: TOKEN.black }} />

          <Box sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>

            {/* 404 number */}
            <Typography
              sx={{
                fontFamily: fontSans,
                fontSize: { xs: '5rem', md: '8rem' },
                fontWeight: 900,
                letterSpacing: '-0.05em',
                lineHeight: 1,
                mb: 2,
                color: 'transparent',
                WebkitTextStroke: `2px ${TOKEN.black}`,
                // Gold fill on alternate chars via CSS trick — simple gradient approach
                background: `linear-gradient(135deg, ${TOKEN.black} 0%, ${TOKEN.gold} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              404
            </Typography>

            <Box sx={{ width: 32, height: 2, bgcolor: TOKEN.gold, mx: 'auto', mb: 3 }} />

            <Typography
              variant="h5"
              fontWeight={700}
              gutterBottom
              sx={{
                fontFamily: fontSans,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                color: TOKEN.black,
              }}
            >
              Page introuvable
            </Typography>

            <Typography
              sx={{
                fontFamily: fontSans,
                color: TOKEN.gray500,
                maxWidth: 400,
                mx: 'auto',
                mb: 5,
                lineHeight: 1.75,
                fontSize: '0.9rem',
              }}
            >
              Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
              Utilisez les liens ci-dessous pour continuer votre navigation.
            </Typography>

            {/* Primary actions */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 5 }}>
              <Button
                component={Link}
                href="/"
                startIcon={<Home sx={{ fontSize: 16 }} />}
                variant="contained"
                size="large"
                sx={{
                  fontFamily: fontSans,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  bgcolor: TOKEN.black,
                  color: TOKEN.white,
                  borderRadius: 1,
                  px: 4,
                  py: 1.4,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: TOKEN.gold, boxShadow: 'none' },
                  transition: 'background 0.2s ease',
                }}
              >
                Accueil
              </Button>
              <Button
                startIcon={<ArrowBack sx={{ fontSize: 16 }} />}
                onClick={() => router.back()}
                variant="outlined"
                size="large"
                sx={{
                  fontFamily: fontSans,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  borderColor: TOKEN.gray300,
                  color: TOKEN.gray700,
                  borderRadius: 1,
                  px: 4,
                  py: 1.4,
                  '&:hover': { borderColor: TOKEN.black, color: TOKEN.black, bgcolor: 'transparent' },
                  transition: 'all 0.2s ease',
                }}
              >
                Page précédente
              </Button>
            </Stack>

            {/* Quick links */}
            <Box sx={{ pt: 4, borderTop: `1px solid ${TOKEN.gray100}` }}>
              <Typography
                sx={{
                  fontFamily: fontSans,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: TOKEN.gray500,
                  mb: 2.5,
                }}
              >
                Liens utiles
              </Typography>

              <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
                {quickLinks.map((item) => (
                  <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                    <Button
                      startIcon={item.icon}
                      sx={{
                        fontFamily: fontSans,
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        color: TOKEN.gray500,
                        border: `1px solid ${TOKEN.gray300}`,
                        borderRadius: 1,
                        px: 2,
                        py: 0.75,
                        '&:hover': { bgcolor: TOKEN.black, color: TOKEN.white, borderColor: TOKEN.black },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </Stack>
            </Box>

            {/* Logo */}
            <Box sx={{ mt: 5, pt: 4, borderTop: `1px solid ${TOKEN.gray100}` }}>
              <Box
                component="img"
                src="/images/logo_santaane.png"
                alt="Global Africa Journal"
                sx={{ height: { xs: 40, md: 52 }, width: 'auto', opacity: 0.45 }}
              />
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}