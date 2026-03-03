'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material';
import { Visibility, VisibilityOff, LockReset, ArrowForward, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import axios from 'axios';

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

const inputSx = {
  '& .MuiOutlinedInput-root': {
    fontFamily: fontSans,
    borderRadius: 1,
    bgcolor: TOKEN.offWhite,
    '& fieldset': { borderColor: TOKEN.gray300 },
    '&:hover fieldset': { borderColor: TOKEN.gray700 },
    '&.Mui-focused fieldset': { borderColor: TOKEN.black, borderWidth: 1.5 },
  },
  '& .MuiInputLabel-root': {
    fontFamily: fontSans,
    fontSize: '0.875rem',
    color: TOKEN.gray500,
    '&.Mui-focused': { color: TOKEN.black },
  },
  '& .MuiOutlinedInput-input': { fontFamily: fontSans, fontSize: '0.9rem' },
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }

    setLoading(true);
    try {
      await axios.post('/api/auth/reset-password-confirm', { token, new_password: password });
      router.push('/login?reset=success');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Le lien a expiré ou est invalide.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Missing token ───
  if (!token) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: TOKEN.offWhite, p: 3 }}>
        <Container maxWidth="xs">
          <Paper elevation={0} sx={{ border: `1px solid ${TOKEN.gray300}`, borderRadius: 2, overflow: 'hidden', bgcolor: TOKEN.white }}>
            <Box sx={{ height: 3, bgcolor: TOKEN.black }} />
            <Box sx={{ p: { xs: 3.5, md: 5 } }}>
              <Alert
                severity="error"
                sx={{ mb: 3, fontFamily: fontSans, fontSize: '0.85rem', borderRadius: 1, border: `1px solid rgba(211,47,47,0.25)` }}
              >
                Token de réinitialisation manquant. Veuillez recommencer la procédure.
              </Alert>
              <Button
                component={Link}
                href="/forgot-password"
                variant="outlined"
                fullWidth
                sx={{
                  fontFamily: fontSans,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  borderColor: TOKEN.black,
                  color: TOKEN.black,
                  borderRadius: 1,
                  py: 1.3,
                  '&:hover': { bgcolor: TOKEN.black, color: TOKEN.white },
                  transition: 'all 0.2s ease',
                }}
              >
                Demander un nouveau lien
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: TOKEN.offWhite,
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.03) 40px)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${TOKEN.gold}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>

        <Button
          startIcon={<ArrowBack sx={{ fontSize: 15 }} />}
          component={Link}
          href="/login"
          sx={{
            fontFamily: fontSans,
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: TOKEN.gray500,
            mb: 3,
            '&:hover': { color: TOKEN.black, bgcolor: 'transparent' },
          }}
        >
          Retour à la connexion
        </Button>

        <Paper elevation={0} sx={{ border: `1px solid ${TOKEN.gray300}`, borderRadius: 2, overflow: 'hidden', bgcolor: TOKEN.white }}>
          <Box sx={{ height: 3, bgcolor: TOKEN.black }} />
          <Box sx={{ p: { xs: 3.5, md: 5 } }}>

            {/* Icon */}
            <Box sx={{ width: 52, height: 52, borderRadius: 1, bgcolor: TOKEN.goldDim, border: `1px solid ${TOKEN.gold}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <LockReset sx={{ fontSize: 24, color: TOKEN.gold }} />
            </Box>

            <Box sx={{ width: 32, height: 2, bgcolor: TOKEN.gold, mb: 2, borderRadius: 1 }} />

            <Typography variant="h5" fontWeight={700} sx={{ fontFamily: fontSans, letterSpacing: '-0.01em', mb: 0.75 }}>
              Nouveau mot de passe
            </Typography>
            <Typography sx={{ fontFamily: fontSans, color: TOKEN.gray500, fontSize: '0.875rem', lineHeight: 1.75, mb: 3.5 }}>
              Saisissez votre nouveau mot de passe pour sécuriser votre compte.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, fontFamily: fontSans, fontSize: '0.85rem', borderRadius: 1, border: `1px solid rgba(211,47,47,0.25)` }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Nouveau mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  sx={inputSx}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: TOKEN.gray500 }}>
                          {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirmer le mot de passe"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  sx={inputSx}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small" sx={{ color: TOKEN.gray500 }}>
                          {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              {/* Password hint */}
              <Typography sx={{ fontFamily: fontSans, fontSize: '0.75rem', color: TOKEN.gray500, mb: 3 }}>
                Minimum 8 caractères requis
              </Typography>

              <Button
                fullWidth
                variant="contained"
                type="submit"
                size="large"
                disabled={loading || !password}
                endIcon={loading ? <CircularProgress size={16} sx={{ color: TOKEN.white }} /> : <ArrowForward sx={{ fontSize: 18 }} />}
                sx={{
                  fontFamily: fontSans,
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  bgcolor: TOKEN.black,
                  color: TOKEN.white,
                  borderRadius: 1,
                  py: 1.5,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: TOKEN.gold, boxShadow: 'none' },
                  '&.Mui-disabled': { bgcolor: TOKEN.gray300, color: TOKEN.gray500 },
                  transition: 'background 0.2s ease',
                }}
              >
                {loading ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f4f0' }}>
        <CircularProgress size={28} sx={{ color: '#b8953a' }} />
      </Box>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}