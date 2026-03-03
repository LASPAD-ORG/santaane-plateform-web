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
  FormControlLabel,
  Checkbox,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { AxiosError } from 'axios';

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
  const [acceptedEthicalCharter, setAcceptedEthicalCharter] = useState(false);
  const [acceptedAPAStyle, setAcceptedAPAStyle] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (!acceptedEthicalCharter) {
      setError('Vous devez accepter la charte éthique et les règles de soumission.');
      return;
    }
    if (!acceptedAPAStyle) {
      setError('Vous devez accepter le formatage des références selon le style APA.');
      return;
    }

    setIsLoading(true);
    try {
      await register({ email: formData.email, password: formData.password, fullName: formData.fullName });
      router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
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

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <InputAdornment position="end">
      <IconButton onClick={toggle} edge="end" size="small" sx={{ color: TOKEN.gray500 }}>
        {show ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
      </IconButton>
    </InputAdornment>
  );

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
          Inscription
        </Typography>
        <Typography sx={{ fontFamily: fontSans, fontSize: '0.875rem', color: TOKEN.gray500 }}>
          Créez votre compte pour soumettre vos travaux
        </Typography>
      </Box>

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
          label="Nom complet"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          required
          autoComplete="name"
          autoFocus
          disabled={isLoading}
          sx={inputSx}
        />

        <TextField
          fullWidth
          label="Adresse email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          required
          autoComplete="email"
          disabled={isLoading}
          sx={inputSx}
        />

        <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
          <TextField
            sx={{ ...inputSx, flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)' } }}
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange('password')}
            required
            autoComplete="new-password"
            disabled={isLoading}
            InputProps={{ endAdornment: eyeBtn(showPassword, () => setShowPassword(!showPassword)) }}
          />
          <TextField
            sx={{ ...inputSx, flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)' } }}
            label="Confirmer le mot de passe"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            required
            autoComplete="new-password"
            disabled={isLoading}
            InputProps={{ endAdornment: eyeBtn(showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword)) }}
          />
        </Box>
      </Box>

      {/* Checkboxes */}
      <Box
        sx={{
          mt: 3.5,
          p: 3,
          borderRadius: 1,
          border: `1px solid ${TOKEN.gray300}`,
          bgcolor: TOKEN.offWhite,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: fontSans,
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: TOKEN.gray500,
            mb: 0.5,
          }}
        >
          Engagements
        </Typography>

        {[
          {
            checked: acceptedEthicalCharter,
            onChange: setAcceptedEthicalCharter,
            label: (
              <Typography sx={{ fontFamily: fontSans, fontSize: '0.82rem', color: TOKEN.gray700, lineHeight: 1.65 }}>
                J&apos;accepte d&apos;avoir lu et validé la{' '}
                <MuiLink
                  href="https://www.globalafricasciences.org/fr/ethical-charter"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  sx={{ color: TOKEN.gold, fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                >
                  charte éthique
                </MuiLink>
                {' '}et les{' '}
                <MuiLink
                  href="https://www.globalafricasciences.org/fr/submission"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  sx={{ color: TOKEN.gold, fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                >
                  règles de soumission
                </MuiLink>
              </Typography>
            ),
          },
          {
            checked: acceptedAPAStyle,
            onChange: setAcceptedAPAStyle,
            label: (
              <Typography sx={{ fontFamily: fontSans, fontSize: '0.82rem', color: TOKEN.gray700, lineHeight: 1.65 }}>
                J&apos;accepte de formater toutes les références selon le{' '}
                <MuiLink
                  href="https://3452f183-579a-4bee-a22d0677afc123bf.filesusr.com/ugd/526d98_9ea1870e53394ea5b34499481c0aed65.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  sx={{ color: TOKEN.gold, fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                >
                  style APA
                </MuiLink>
              </Typography>
            ),
          },
        ].map((item, i) => (
          <FormControlLabel
            key={i}
            control={
              <Checkbox
                checked={item.checked}
                onChange={(e) => item.onChange(e.target.checked)}
                disabled={isLoading}
                size="small"
                sx={{
                  color: TOKEN.gray300,
                  '&.Mui-checked': { color: TOKEN.black },
                  mt: '-2px',
                }}
              />
            }
            label={item.label}
            sx={{ alignItems: 'flex-start', mr: 0 }}
          />
        ))}
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
        {isLoading ? "Inscription en cours…" : "S'inscrire"}
      </Button>

      <Divider sx={{ my: 3, borderColor: TOKEN.gray100 }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontFamily: fontSans, fontSize: '0.85rem', color: TOKEN.gray500 }}>
          Vous avez déjà un compte ?{' '}
          <MuiLink
            component={Link}
            href="/login"
            underline="none"
            sx={{
              fontFamily: fontSans,
              fontWeight: 700,
              color: TOKEN.black,
              '&:hover': { color: TOKEN.gold },
              transition: 'color 0.2s',
            }}
          >
            Se connecter
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}