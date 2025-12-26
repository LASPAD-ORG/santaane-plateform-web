'use client';

import { Box, Container, AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import { Login } from '@mui/icons-material';
import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fafafa' }}>
      {/* Header */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'white', 
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/images/logo_santaane.png" alt="Santaane" style={{ height: 100, padding: 10 }} />
            </Link>
            
            <Stack direction="row" spacing={2}>
              <Link href="/manuscripts" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ color: 'text.secondary' }}>
                  Publications
                </Button>
              </Link>
              <Link href="/themes" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ color: 'text.secondary' }}>
                  Thèmes Ouverts
                </Button>
              </Link>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Login />}
                  sx={{ 
                    borderRadius: 2,
                    borderColor: '#59a498',
                    color: '#59a498',
                    '&:hover': {
                      borderColor: '#59a498',
                      bgcolor: 'rgba(89, 164, 152, 0.08)',
                    }
                  }}
                >
                  Connexion
                </Button>
              </Link>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 4, 
          bgcolor: 'white', 
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="xl">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Santaane - Plateforme de publication scientifique
            </Typography>
            <Stack direction="row" spacing={3}>
              <Link href="/about" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: '#ff9d00' } }}>
                  À propos
                </Typography>
              </Link>
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: '#ff9d00' } }}>
                  Contact
                </Typography>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
