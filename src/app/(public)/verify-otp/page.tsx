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
import { MarkEmailRead as EmailIcon, Security as SecurityIcon } from '@mui/icons-material';
import axios from 'axios';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Rediriger si l'email est manquant dans l'URL
  useEffect(() => {
    if (!email) {
      router.push('/register');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (otp.length !== 6) {
      setError('Le code doit contenir 6 chiffres.');
      return;
    }

    setIsLoading(true);
    try {
      // Appel direct au proxy Next.js ou backend
      // Note: Assurez-vous d'avoir créé la route correspondante dans app/api/auth/verify-otp
      await axios.post('/api/auth/verify-otp', { email, code: otp });
      
      setMessage('Compte vérifié avec succès ! Redirection vers la connexion...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
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
      setError(err.response?.data?.detail || 'Erreur lors de l\'envoi du code.');
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
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <SecurityIcon color="primary" sx={{ fontSize: 60 }} />
          </Box>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Vérification de l'email
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Un code de vérification a été envoyé à : <br />
            <strong>{email}</strong>
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Code OTP (6 chiffres)"
              variant="outlined"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              required
              sx={{ mb: 3 }}
              inputProps={{ 
                style: { textAlign: 'center', letterSpacing: '8px', fontSize: '24px' },
                inputMode: 'numeric' 
              }}
              disabled={isLoading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || otp.length < 6}
              sx={{ mb: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Vérifier mon compte'}
            </Button>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Vous n'avez pas reçu le code ?{' '}
                <MuiLink
                  component="button"
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  sx={{ fontWeight: 'bold', cursor: 'pointer', verticalAlign: 'baseline' }}
                >
                  {isResending ? 'Envoi...' : 'Renvoyer un code'}
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

// Composant principal avec Suspense pour useSearchParams()
export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>}>
      <VerifyOtpContent />
    </Suspense>
  );
}