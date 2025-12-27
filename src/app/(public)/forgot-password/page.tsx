'use client';

import { useState } from 'react';
import { Box, Container, Paper, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { Email as EmailIcon, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage(''); // Réinitialise le message au début de la requête

    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      
      // Extraction sécurisée du message de succès
      // On s'assure que 'message' finit toujours par être une string
      const successData = res.data;
      const successMsg = typeof successData === 'string' 
        ? successData 
        : (successData.message || "Un lien a été envoyé si l'adresse existe.");
        
      setMessage(successMsg);
      setStatus('success');
    } catch (err: any) {
      // Gestion robuste des erreurs (FastAPI utilise souvent .detail)
      let errorMsg = "Une erreur est survenue.";
      
      if (err.response?.data) {
        const data = err.response.data;
        // Vérifie les formats standards de FastAPI (.detail) ou custom (.error, .message)
        errorMsg = typeof data === 'string' ? data : (data.detail || data.error || data.message || errorMsg);
      }
      
      setMessage(errorMsg);
      setStatus('error');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <EmailIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" gutterBottom>Mot de passe oublié ?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Entrez votre email. <br></br>
            Nous vous enverrons un lien de réinitialisation 
            valable 5 minutes
          </Typography>

          {/* Affichage du succès */}
          {status === 'success' && (
            <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
              {message}
            </Alert>
          )}

          {/* Formulaire - Reste visible en cas d'erreur, disparaît en cas de succès */}
          {status !== 'success' && (
            <Box component="form" onSubmit={handleSubmit}>
              {status === 'error' && (
                <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
                  {message}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Adresse Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 3 }}
                disabled={status === 'loading'}
                placeholder="votre@email.com"
              />
              <Button 
                fullWidth 
                variant="contained" 
                size="large" 
                type="submit" 
                disabled={status === 'loading' || !email}
              >
                {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : "Envoyer le lien"}
              </Button>
            </Box>
          )}

          <Button 
            startIcon={<ArrowBack />} 
            component={Link} 
            href="/login" 
            sx={{ mt: 3 }}
          >
            Retour à la connexion
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}