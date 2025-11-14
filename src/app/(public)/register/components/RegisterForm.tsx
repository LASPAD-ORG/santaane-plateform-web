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
import { Visibility, VisibilityOff, PersonAdd as RegisterIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { getDefaultRouteForRole } from '@/config/roles';
import { AxiosError } from 'axios';

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });

      // Get user roles and redirect to appropriate dashboard
      const currentUser = useAuthStore.getState().user;
      if (currentUser && currentUser.roles.length > 0) {
        // Redirect to the first role's default route (you can customize priority)
        const defaultRoute = getDefaultRouteForRole(currentUser.roles[0]);
        router.push(defaultRoute);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string; message?: string }>;
      const errorMessage =
        axiosError.response?.data?.detail ||
        axiosError.response?.data?.message ||
        "Une erreur s'est produite lors de l'inscription.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
        Inscription
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Nom complet"
        value={formData.fullName}
        onChange={handleChange('fullName')}
        required
        margin="normal"
        autoComplete="name"
        autoFocus
        disabled={isLoading}
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        required
        margin="normal"
        autoComplete="email"
        disabled={isLoading}
      />

      <TextField
        fullWidth
        label="Mot de passe"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange('password')}
        required
        margin="normal"
        autoComplete="new-password"
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

      <TextField
        fullWidth
        label="Confirmer le mot de passe"
        type={showConfirmPassword ? 'text' : 'password'}
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
        required
        margin="normal"
        autoComplete="new-password"
        disabled={isLoading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
        startIcon={<RegisterIcon />}
        sx={{ mt: 3, mb: 2 }}
      >
        {isLoading ? 'Inscription en cours...' : "S'inscrire"}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Vous avez déjà un compte ?{' '}
          <MuiLink component={Link} href="/login" underline="hover">
            Se connecter
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
