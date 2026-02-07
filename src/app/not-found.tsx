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
  Search,
  ArrowBack,
  MenuBook,
  Article,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #59a498 0%, #ff9d00 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background circles */}
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 300, md: 500 },
          height: { xs: 300, md: 500 },
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          top: '-150px',
          right: '-150px',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 200, md: 350 },
          height: { xs: 200, md: 350 },
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          bottom: '-100px',
          left: '-100px',
          animation: 'float 8s ease-in-out infinite',
        }}
      />

      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            bgcolor: 'white',
          }}
        >
          {/* 404 Number */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '6rem', md: '10rem' },
              fontWeight: 900,
              background: 'linear-gradient(135deg, #59a498 0%, #ff9d00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              mb: 2,
            }}
          >
            404
          </Typography>

          {/* Message */}
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Page introuvable
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 500, mx: 'auto', mb: 4, fontSize: { xs: '0.95rem', md: '1.05rem' } }}
          >
            Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée. Utilisez les liens ci-dessous pour
            continuer votre navigation.
          </Typography>

          {/* Action buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              component={Link}
              href="/"
              sx={{
                bgcolor: '#ff9d00',
                '&:hover': { bgcolor: '#e68a00' },
                px: 3,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              Retour à l&apos;accueil
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => router.back()}
              sx={{
                borderColor: '#59a498',
                color: '#59a498',
                '&:hover': {
                  borderColor: '#59a498',
                  bgcolor: 'rgba(89, 164, 152, 0.08)',
                },
                px: 3,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              Page précédente
            </Button>
          </Stack>

          {/* Quick links */}
          <Box sx={{ pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
              Liens utiles
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              <Link href="/manuscripts" style={{ textDecoration: 'none' }}>
                <Button
                  startIcon={<Article />}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: '#ff9d00', bgcolor: 'rgba(255, 157, 0, 0.08)' },
                  }}
                >
                  Publications
                </Button>
              </Link>
              <Link href="/themes" style={{ textDecoration: 'none' }}>
                <Button
                  startIcon={<MenuBook />}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: '#ff9d00', bgcolor: 'rgba(255, 157, 0, 0.08)' },
                  }}
                >
                  Appels ouverts
                </Button>
              </Link>
              <Link href="/guide-soumission" style={{ textDecoration: 'none' }}>
                <Button
                  startIcon={<Search />}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: '#ff9d00', bgcolor: 'rgba(255, 157, 0, 0.08)' },
                  }}
                >
                  Guide de soumission
                </Button>
              </Link>
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                <Button
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: '#ff9d00', bgcolor: 'rgba(255, 157, 0, 0.08)' },
                  }}
                >
                  Contact
                </Button>
              </Link>
            </Box>
          </Box>

          {/* Logo */}
          <Box sx={{ mt: 4 }}>
            <Box
              component="img"
              src="/images/logo_santaane.png"
              alt="Santaane"
              sx={{
                height: { xs: 50, md: 70 },
                width: 'auto',
                opacity: 0.6,
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
