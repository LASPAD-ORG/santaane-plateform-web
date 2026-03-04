"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Paper, CircularProgress, Typography } from '@mui/material';
import LoginForm from './components/LoginForm';
import { useAuthStore } from '@/stores/authStore';

// ─── Design tokens ───
const TOKEN = {
  black: '#0a0a0a',
  white: '#ffffff',
  offWhite: '#f5f4f0',
  gray100: '#f0efeb',
  gray300: '#d4d2cc',
  gold: '#b8953a',
};

const fontSans = '"Noto Sans", sans-serif';

export default function LoginPage() {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    checkAuthentication();
  }, [checkAuth]);

  useEffect(() => {
    if (!isChecking && user) {
      router.replace('/dashboard');
    }
  }, [user, isChecking, router]);

  // ─── Loading state ───
  if (isChecking) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: TOKEN.offWhite,
        }}
      >
        <CircularProgress size={28} sx={{ color: TOKEN.gold }} />
      </Box>
    );
  }

  if (user) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: TOKEN.offWhite,
        position: 'relative',
        overflow: 'hidden',
        // Grid background
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.03) 40px)',
          pointerEvents: 'none',
        },
        // Gold halo
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${TOKEN.gold}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      }}
    >
      {/* Left decorative panel (desktop only) */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flex: '0 0 40%',
          bgcolor: TOKEN.black,
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${TOKEN.gold}20 0%, transparent 70%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Box>
          <Box sx={{ width: 40, height: 2, bgcolor: TOKEN.gold, mb: 3 }} />
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              fontFamily: fontSans,
              color: TOKEN.white,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              fontSize: '2.4rem',
              mb: 2,
            }}
          >
            Global Africa Journal
          </Typography>
          <Typography
            sx={{
              fontFamily: fontSans,
              color: TOKEN.gray300,
              fontSize: '0.95rem',
              lineHeight: 1.75,
              maxWidth: 280,
            }}
          >
            Plateforme de publication scientifique du LASPAD — Université Gaston Berger, Saint-Louis.
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: fontSans,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: TOKEN.gray300,}}
        >
          © {new Date().getFullYear()} LASPAD · UGB
        </Typography>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, md: 4 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="xs" disableGutters>
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${TOKEN.gray300}`,
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: TOKEN.white,
            }}
          >
            {/* Top accent stripe */}
            <Box sx={{ height: 3, bgcolor: TOKEN.black }} />
            <Box sx={{ p: { xs: 3.5, md: 5 } }}>
              <LoginForm />
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}