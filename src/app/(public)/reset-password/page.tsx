'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Container, Paper, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import Link from 'next/link';
import axios from 'axios';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Réinitialise l'erreur au début de la tentative

    // Validations côté client
    if (password !== confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }
    if (password.length < 8) {
      return setError("Le mot de passe doit contenir au moins 8 caractères.");
    }

    setLoading(true);
    try {
      // Appel à la route proxy Next.js
      await axios.post('/api/auth/reset-password-confirm', { 
        token, 
        new_password: password 
      });
      
      // Redirection vers login avec un message de succès
      router.push('/login?reset=success');
    } catch (err: any) {
      // Récupération du message d'erreur précis du backend (ex: expiration des 5 min)
      const errorDetail = err.response?.data?.detail || "Le lien a expiré ou est invalide.";
      setError(errorDetail);
    } finally {
      setLoading(false);
    }
  };

  // Si le token est absent de l'URL
  if (!token) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Alert severity="error">
          Token de réinitialisation manquant. Veuillez recommencer la procédure.
          <Box sx={{ mt: 2 }}>
            <Button component={Link} href="/forgot-password" variant="outlined" size="small">
              Demander un nouveau lien
            </Button>
          </Box>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
          Nouveau mot de passe
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Veuillez saisir votre nouveau mot de passe ci-dessous pour sécuriser votre compte.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            label="Nouveau mot de passe" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            required
            disabled={loading}
          />
          <TextField 
            fullWidth 
            label="Confirmer le nouveau mot de passe" 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 3 }}
            required
            disabled={loading}
          />
          <Button 
            fullWidth 
            variant="contained" 
            type="submit" 
            size="large"
            disabled={loading || !password}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Mettre à jour le mot de passe"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}