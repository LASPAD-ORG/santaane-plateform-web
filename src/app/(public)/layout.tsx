'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { Login, Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuItems = [
    { label: 'Accueil', path: '/' },
    { label: 'Publications', path: '/manuscripts' },
    { label: 'Appels Ouverts', path: '/appels' },
    { label: 'Guide de soumission', path: '/guide-soumission' },
    { label: 'À propos', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Connexion', path: '/login', variant: 'outlined' as const },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fafafa' }}>
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              justifyContent: 'space-between',
              minHeight: { xs: 56, sm: 64, md: 70 },
              py: { xs: 0.5, sm: 1 },
            }}
          >
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Box
                component="img"
                src="/images/logo_santaane.png"
                alt="Santaane"
                sx={{
                  height: { xs: 50, sm: 70, md: 100 },
                  width: 'auto',
                  py: { xs: 0.5, sm: 1 },
                }}
              />
            </Link>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              <Link href="/manuscripts" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  Publications
                </Button>
              </Link>
              <Link href="/appels" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  Appels
                </Button>
              </Link>
              <Link href="/guide-soumission" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  Guide
                </Button>
              </Link>
              <Link href="/about" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  À propos
                </Button>
              </Link>
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  Contact
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
                    fontSize: '0.875rem',
                    '&:hover': {
                      borderColor: '#59a498',
                      bgcolor: 'rgba(89, 164, 152, 0.08)',
                    },
                  }}
                >
                  Connexion
                </Button>
              </Link>
            </Box>

            {/* Mobile Menu Icon */}
            <IconButton
              sx={{ display: { xs: 'block', sm: 'none' } }}
              onClick={handleMobileMenuToggle}
              edge="end"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Menu
          </Typography>
          <IconButton onClick={handleMobileMenuToggle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <List sx={{ px: 1, py: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <Link
                href={item.path}
                style={{ textDecoration: 'none', width: '100%' }}
                onClick={handleMobileMenuToggle}
              >
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'rgba(89, 164, 152, 0.08)',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={item.variant === 'outlined' ? 600 : 400}
                        color={item.variant === 'outlined' ? '#59a498' : 'text.primary'}
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: { xs: 3, md: 4 },
          bgcolor: 'white',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              © {new Date().getFullYear()} Santaane - Plateforme de publication scientifique
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/about" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: '#ff9d00' } }}>
                  À propos
                </Typography>
              </Link>
              <Link href="/guide-soumission" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: '#ff9d00' } }}>
                  Guide de soumission
                </Typography>
              </Link>
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: '#ff9d00' } }}>
                  Contact
                </Typography>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
