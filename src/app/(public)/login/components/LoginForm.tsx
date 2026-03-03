'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { getDefaultRouteForRoles } from '@/config/roles';
import { AxiosError } from 'axios';

// ─── Design tokens ───
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
  '& .MuiOutlinedInput-input': {
    fontFamily: fontSans,
    fontSize: '0.9rem',
  },
};

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      const currentUser = useAuthStore.getState().user;
      if (currentUser && currentUser.roles.length > 0) {
        const defaultRoute = getDefaultRouteForRoles(currentUser.roles);
        router.push(defaultRoute);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string; message?: string }>;

      if (axiosError.response?.status === 403) {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        return;
      }

      const errorMessage =
        axiosError.response?.data?.detail ||
        axiosError.response?.data?.message ||
        'Identifiants incorrects. Veuillez réessayer.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ width: 32, height: 2, bgcolor: TOKEN.gold, mb: 2, borderRadius: 1 }} />
        <Typography
          variant="h4"
          component="h1"
          fontWeight={700}
          sx={{
            fontFamily: fontSans,
            letterSpacing: '-0.02em',
            fontSize: { xs: '1.6rem', md: '1.9rem' },
            color: TOKEN.black,
            mb: 0.5,
          }}
        >
          Connexion
        </Typography>
        <Typography
          sx={{
            fontFamily: fontSans,
            fontSize: '0.875rem',
            color: TOKEN.gray500,
          }}
        >
          Accédez à votre espace de publication
        </Typography>
      </Box>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            fontFamily: fontSans,
            fontSize: '0.85rem',
            borderRadius: 1,
            border: `1px solid rgba(211,47,47,0.25)`,
          }}
        >
          {error}
        </Alert>
      )}

      {/* Fields */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          fullWidth
          label="Adresse email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          autoFocus
          disabled={isLoading}
          sx={inputSx}
        />

        <TextField
          fullWidth
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={isLoading}
          sx={inputSx}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                  sx={{ color: TOKEN.gray500 }}
                >
                  {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Forgot password */}
      <Box sx={{ textAlign: 'right', mt: 1.5 }}>
        <MuiLink
          component={Link}
          href="/forgot-password"
          underline="none"
          sx={{
            fontFamily: fontSans,
            fontSize: '0.8rem',
            color: TOKEN.gray500,
            letterSpacing: '0.01em',
            '&:hover': { color: TOKEN.gold },
            transition: 'color 0.2s',
          }}
        >
          Mot de passe oublié ?
        </MuiLink>
      </Box>

      {/* Submit */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading}
        endIcon={
          isLoading
            ? <CircularProgress size={16} sx={{ color: TOKEN.white }} />
            : <ArrowForward sx={{ fontSize: 18 }} />
        }
        sx={{
          mt: 3,
          mb: 1,
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
        {isLoading ? 'Connexion en cours…' : 'Se connecter'}
      </Button>

      <Divider sx={{ my: 3, borderColor: TOKEN.gray100 }} />

      {/* Register link */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          sx={{
            fontFamily: fontSans,
            fontSize: '0.85rem',
            color: TOKEN.gray500,
          }}
        >
          Pas encore de compte ?{' '}
          <MuiLink
            component={Link}
            href="/register"
            underline="none"
            sx={{
              fontFamily: fontSans,
              fontWeight: 700,
              color: TOKEN.black,
              '&:hover': { color: TOKEN.gold },
              transition: 'color 0.2s',
            }}
          >
            S&apos;inscrire
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}