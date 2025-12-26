'use client';

import { Box, Button, Typography, Container } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h1" color="primary" sx={{ fontSize: '6rem', fontWeight: 'bold' }}>
          404
        </Typography>

        <Typography variant="h5" gutterBottom>
          Page non trouvée
        </Typography>

        <Typography variant="body1" color="text.secondary">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
          >
            Retour
          </Button>

          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => router.push('/dashboard')}
          >
            Accueil
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
