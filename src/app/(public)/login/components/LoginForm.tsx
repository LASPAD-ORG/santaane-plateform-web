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
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { getDefaultRouteForRoles } from '@/config/roles';
import { AxiosError } from 'axios';

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

      // Get user roles and redirect to appropriate dashboard
      const currentUser = useAuthStore.getState().user;
      if (currentUser && currentUser.roles.length > 0) {
        // Redirect based on role priority: SUPER_ADMIN > EDITOR > EVALUATOR > MENTOR > AUTHOR
        const defaultRoute = getDefaultRouteForRoles(currentUser.roles);
        router.push(defaultRoute);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string; message?: string }>;
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
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
        Connexion
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        margin="normal"
        autoComplete="email"
        autoFocus
        disabled={isLoading}
      />

      <TextField
        fullWidth
        label="Mot de passe"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        margin="normal"
        autoComplete="current-password"
        disabled={isLoading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading}
        startIcon={<LoginIcon />}
        sx={{ mt: 3, mb: 2 }}
      >
        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Pas encore de compte ?{' '}
          <MuiLink component={Link} href="/register" underline="hover">
            S&apos;inscrire
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
