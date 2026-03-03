'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Email as EmailIcon, ArrowBack, CheckCircle } from '@mui/icons-material';
import Link from 'next/link';
import axios from 'axios';

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
    bgcolor: TOKEN.white,
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      const successData = res.data;
      const successMsg =
        typeof successData === 'string'
          ? successData
          : successData.message || "Un lien a été envoyé si l'adresse existe.";
      setMessage(successMsg);
      setStatus('success');
    } catch (err: any) {
      let errorMsg = 'Une erreur est survenue.';
      if (err.response?.data) {
        const data = err.response.data;
        errorMsg =
          typeof data === 'string'
            ? data
            : data.detail || data.error || data.message || errorMsg;
      }
      setMessage(errorMsg);
      setStatus('error');
    }
  };

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
        // Subtle grid background
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.03) 40px)',
          pointerEvents: 'none',
        },
        // Gold halo top-right
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${TOKEN.gold}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>

        {/* Back link */}
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

          <Box sx={{ p: { xs: 3.5, md: 5 } }}>

            {status === 'success' ? (
              /* ─── SUCCESS STATE ─── */
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: TOKEN.goldDim,
                    border: `1px solid ${TOKEN.gold}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <CheckCircle sx={{ fontSize: 28, color: TOKEN.gold }} />
                </Box>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    fontFamily: fontSans,
                    letterSpacing: '-0.01em',
                    mb: 1.5,
                  }}
                >
                  Email envoyé
                </Typography>

                <Typography
                  sx={{
                    fontFamily: fontSans,
                    color: TOKEN.gray500,
                    fontSize: '0.9rem',
                    lineHeight: 1.75,
                    mb: 4,
                  }}
                >
                  {message}
                </Typography>

                <Button
                  component={Link}
                  href="/login"
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
                    '&:hover': {
                      bgcolor: TOKEN.black,
                      color: TOKEN.white,
                      borderColor: TOKEN.black,
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Retour à la connexion
                </Button>
              </Box>
            ) : (
              /* ─── FORM STATE ─── */
              <>
                {/* Icon */}
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 1,
                    bgcolor: TOKEN.goldDim,
                    border: `1px solid ${TOKEN.gold}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <EmailIcon sx={{ fontSize: 24, color: TOKEN.gold }} />
                </Box>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    fontFamily: fontSans,
                    letterSpacing: '-0.01em',
                    mb: 0.75,
                  }}
                >
                  Mot de passe oublié ?
                </Typography>

                <Typography
                  sx={{
                    fontFamily: fontSans,
                    color: TOKEN.gray500,
                    fontSize: '0.875rem',
                    lineHeight: 1.75,
                    mb: 3.5,
                  }}
                >
                  Entrez votre adresse email. Nous vous enverrons un lien de réinitialisation valable{' '}
                  <Box component="span" sx={{ fontWeight: 600, color: TOKEN.gray700 }}>
                    5 minutes
                  </Box>
                  .
                </Typography>

                {/* Error alert */}
                {status === 'error' && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      fontFamily: fontSans,
                      fontSize: '0.85rem',
                      borderRadius: 1,
                      border: `1px solid rgba(211,47,47,0.3)`,
                    }}
                  >
                    {message}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Adresse email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === 'loading'}
                    placeholder="votre@email.com"
                    sx={{ ...inputSx, mb: 3 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={status === 'loading' || !email}
                    sx={{
                      fontFamily: fontSans,
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      bgcolor: TOKEN.black,
                      color: TOKEN.white,
                      borderRadius: 1,
                      py: 1.4,
                      boxShadow: 'none',
                      '&:hover': { bgcolor: TOKEN.gold, boxShadow: 'none' },
                      '&.Mui-disabled': {
                        bgcolor: TOKEN.gray300,
                        color: TOKEN.gray500,
                      },
                      transition: 'background 0.2s ease',
                    }}
                  >
                    {status === 'loading' ? (
                      <CircularProgress size={20} sx={{ color: TOKEN.white }} />
                    ) : (
                      'Envoyer le lien'
                    )}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Paper>

      </Container>
    </Box>
  );
}