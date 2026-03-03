'use client';

import { useState, useEffect, Suspense } from 'react';
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
  Link as MuiLink,
} from '@mui/material';
import { Security as SecurityIcon, CheckCircle } from '@mui/icons-material';
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

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!email) router.push('/register');
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (otp.length !== 6) { setError('Le code doit contenir 6 chiffres.'); return; }
    setIsLoading(true);
    try {
      await axios.post('/api/auth/verify-otp', { email, code: otp });
      setVerified(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Code invalide ou expiré.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setMessage('');
    setIsResending(true);
    try {
      await axios.post('/api/auth/resend-otp', { email });
      setMessage('Un nouveau code a été envoyé à votre adresse email.');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erreur lors de l'envoi du code.");
    } finally {
      setIsResending(false);
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
        <Paper elevation={0} sx={{ border: `1px solid ${TOKEN.gray300}`, borderRadius: 2, overflow: 'hidden', bgcolor: TOKEN.white }}>
          <Box sx={{ height: 3, bgcolor: TOKEN.black }} />
          <Box sx={{ p: { xs: 3.5, md: 5 } }}>

            {verified ? (
              /* ─── Success state ─── */
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: TOKEN.goldDim, border: `1px solid ${TOKEN.gold}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                  <CheckCircle sx={{ fontSize: 28, color: TOKEN.gold }} />
                </Box>
                <Typography variant="h5" fontWeight={700} sx={{ fontFamily: fontSans, letterSpacing: '-0.01em', mb: 1 }}>
                  Compte vérifié !
                </Typography>
                <Typography sx={{ fontFamily: fontSans, color: TOKEN.gray500, fontSize: '0.875rem', lineHeight: 1.75 }}>
                  Redirection vers la connexion…
                </Typography>
                <CircularProgress size={20} sx={{ color: TOKEN.gold, mt: 3 }} />
              </Box>
            ) : (
              <>
                {/* Icon */}
                <Box sx={{ width: 52, height: 52, borderRadius: 1, bgcolor: TOKEN.goldDim, border: `1px solid ${TOKEN.gold}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <SecurityIcon sx={{ fontSize: 24, color: TOKEN.gold }} />
                </Box>

                <Box sx={{ width: 32, height: 2, bgcolor: TOKEN.gold, mb: 2, borderRadius: 1 }} />

                <Typography variant="h5" fontWeight={700} sx={{ fontFamily: fontSans, letterSpacing: '-0.01em', mb: 0.75 }}>
                  Vérification de l&apos;email
                </Typography>
                <Typography sx={{ fontFamily: fontSans, color: TOKEN.gray500, fontSize: '0.875rem', lineHeight: 1.75, mb: 3.5 }}>
                  Un code de vérification a été envoyé à{' '}
                  <Box component="strong" sx={{ color: TOKEN.black, fontWeight: 600 }}>{email}</Box>
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 3, fontFamily: fontSans, fontSize: '0.85rem', borderRadius: 1, border: `1px solid rgba(211,47,47,0.25)` }}>
                    {error}
                  </Alert>
                )}
                {message && (
                  <Alert severity="success" sx={{ mb: 3, fontFamily: fontSans, fontSize: '0.85rem', borderRadius: 1 }}>
                    {message}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Code à 6 chiffres"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="• • • • • •"
                    required
                    disabled={isLoading}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        fontFamily: fontSans,
                        borderRadius: 1,
                        bgcolor: TOKEN.offWhite,
                        '& fieldset': { borderColor: TOKEN.gray300 },
                        '&:hover fieldset': { borderColor: TOKEN.gray700 },
                        '&.Mui-focused fieldset': { borderColor: TOKEN.black, borderWidth: 1.5 },
                      },
                      '& .MuiInputLabel-root': { fontFamily: fontSans, color: TOKEN.gray500, '&.Mui-focused': { color: TOKEN.black } },
                      '& .MuiOutlinedInput-input': {
                        fontFamily: fontSans,
                        textAlign: 'center',
                        letterSpacing: '0.6em',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        py: 2,
                      },
                    }}
                    inputProps={{ inputMode: 'numeric' }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading || otp.length < 6}
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
                      mb: 3,
                    }}
                  >
                    {isLoading ? <CircularProgress size={20} sx={{ color: TOKEN.white }} /> : 'Vérifier mon compte'}
                  </Button>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontFamily: fontSans, fontSize: '0.82rem', color: TOKEN.gray500 }}>
                      Vous n&apos;avez pas reçu le code ?{' '}
                      <MuiLink
                        component="button"
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResending}
                        underline="none"
                        sx={{
                          fontFamily: fontSans,
                          fontWeight: 700,
                          color: isResending ? TOKEN.gray300 : TOKEN.black,
                          cursor: 'pointer',
                          verticalAlign: 'baseline',
                          '&:hover': { color: TOKEN.gold },
                          transition: 'color 0.2s',
                        }}
                      >
                        {isResending ? 'Envoi…' : 'Renvoyer un code'}
                      </MuiLink>
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f4f0' }}>
        <CircularProgress size={28} sx={{ color: '#b8953a' }} />
      </Box>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}