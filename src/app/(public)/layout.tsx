'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  AppBar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Stack,
  Divider,
} from '@mui/material';
import { Login, Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
const NAVBAR_HEIGHT = 68;

const navLinks = [
  { label: 'Publications', path: '/manuscripts' },
  { label: 'Appels', path: '/appels' },
  { label: 'Guide', path: '/guide-soumission' },
  { label: 'À propos', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const footerLinks = [
  { label: 'À propos', path: '/about' },
  { label: 'Guide de soumission', path: '/guide-soumission' },
  { label: 'Contact', path: '/contact' },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: TOKEN.offWhite }}>

      {/* ─── NAVBAR ─── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: TOKEN.white,
          borderBottom: `1px solid ${TOKEN.gray300}`,
          color: TOKEN.black,
          height: NAVBAR_HEIGHT,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ height: '100%' }}
        >
          {/* On remplace Toolbar par Box pour éviter les overrides MUI */}
          <Box
            sx={{
              height: `${NAVBAR_HEIGHT}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Box
                component="img"
                src="/images/logo/02-GA-Site-Page-Noir.gif"
                alt="Global Africa Journal"
                sx={{
                  height: 48,
                  width: 'auto',
                  display: 'block',
                }}
              />
            </Link>

            {/* Desktop nav */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 0.5,
                flex: 1,
                justifyContent: 'center',
                height: '100%',
              }}
            >
              {navLinks.map((item) => (
                <Link key={item.path} href={item.path} style={{ textDecoration: 'none', height: '100%', display: 'flex', alignItems: 'stretch' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 1.5,
                      fontFamily: fontSans,
                      fontWeight: isActive(item.path) ? 700 : 500,
                      fontSize: '0.82rem',
                      letterSpacing: '0.02em',
                      color: isActive(item.path) ? TOKEN.black : TOKEN.gray500,
                      cursor: 'pointer',
                      position: 'relative',
                      // Trait jaune en bas — droit, pas arrondi
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        bgcolor: isActive(item.path) ? TOKEN.gold : 'transparent',
                        borderRadius: 0, // droit
                      },
                      '&:hover': {
                        color: TOKEN.black,
                        '&::after': {
                          bgcolor: TOKEN.gray300,
                        },
                      },
                      transition: 'color 0.15s ease',
                    }}
                  >
                    {item.label}
                  </Box>
                </Link>
              ))}
            </Box>

            {/* Desktop CTA */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexShrink: 0 }}>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button
                  endIcon={<Login sx={{ fontSize: 16 }} />}
                  sx={{
                    fontFamily: fontSans,
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    bgcolor: TOKEN.black,
                    color: TOKEN.white,
                    borderRadius: 1,
                    px: 2.5,
                    py: 0.9,
                    boxShadow: 'none',
                    '&:hover': { bgcolor: TOKEN.gold, boxShadow: 'none' },
                    transition: 'background 0.2s ease',
                  }}
                >
                  Connexion
                </Button>
              </Link>
            </Box>

            {/* Mobile menu icon */}
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              sx={{
                display: { xs: 'flex', md: 'none' },
                color: TOKEN.black,
                border: `1px solid ${TOKEN.gray300}`,
                borderRadius: 1,
                p: 0.75,
              }}
            >
              <MenuIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Box>
        </Container>
      </AppBar>

      {/* ─── MOBILE DRAWER ─── */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 300,
            bgcolor: TOKEN.white,
            borderLeft: `1px solid ${TOKEN.gray300}`,
          },
        }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            borderBottom: `1px solid ${TOKEN.gray100}`,
          }}
        >
          <Box sx={{ width: 28, height: 2, bgcolor: TOKEN.gold, borderRadius: 0 }} />
          <IconButton
            onClick={() => setMobileMenuOpen(false)}
            size="small"
            sx={{ color: TOKEN.gray500, '&:hover': { color: TOKEN.black } }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Nav items */}
        <Box sx={{ p: 3 }}>
          <Stack spacing={0.5}>
            {navLinks.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                style={{ textDecoration: 'none' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: isActive(item.path) ? TOKEN.goldDim : 'transparent',
                    borderLeft: `3px solid ${isActive(item.path) ? TOKEN.gold : 'transparent'}`,
                    transition: 'all 0.15s ease',
                    '&:hover': { bgcolor: TOKEN.gray100 },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fontSans,
                      fontWeight: isActive(item.path) ? 700 : 500,
                      fontSize: '0.9rem',
                      color: isActive(item.path) ? TOKEN.black : TOKEN.gray700,
                    }}
                  >
                    {item.label}
                  </Typography>
                  {isActive(item.path) && (
                    <Box sx={{ width: 6, height: 6, borderRadius: 0, bgcolor: TOKEN.gold }} />
                  )}
                </Box>
              </Link>
            ))}
          </Stack>

          <Divider sx={{ borderColor: TOKEN.gray100, my: 3 }} />

          <Link href="/login" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
            <Button
              fullWidth
              endIcon={<Login sx={{ fontSize: 16 }} />}
              sx={{
                fontFamily: fontSans,
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                bgcolor: TOKEN.black,
                color: TOKEN.white,
                borderRadius: 1,
                py: 1.3,
                boxShadow: 'none',
                '&:hover': { bgcolor: TOKEN.gold, boxShadow: 'none' },
              }}
            >
              Connexion
            </Button>
          </Link>
        </Box>

        {/* Drawer footer */}
        <Box sx={{ mt: 'auto', p: 3, borderTop: `1px solid ${TOKEN.gray100}` }}>
          <Typography
            sx={{
              fontFamily: fontSans,
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: TOKEN.gray500,
            }}
          >
            © {new Date().getFullYear()} LASPAD · UGB
          </Typography>
        </Box>
      </Drawer>

      {/* ─── MAIN ─── */}
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      {/* ─── FOOTER ─── */}
      <Box
        component="footer"
        sx={{
          bgcolor: TOKEN.black,
          borderTop: `1px solid rgba(255,255,255,0.06)`,
          py: { xs: 4, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 3,
            }}
          >
            {/* Brand */}
            <Box>
              <Box sx={{ width: 28, height: 2, bgcolor: TOKEN.gold, mb: 1.5, borderRadius: 0 }} />
              <Typography
                sx={{
                  fontFamily: fontSans,
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: TOKEN.white,
                  letterSpacing: '-0.01em',
                  mb: 0.5,
                }}
              >
                Global Africa Journal
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontSans,
                  fontSize: '0.75rem',
                  color: TOKEN.gray500,
                  letterSpacing: '0.01em',
                }}
              >
                © {new Date().getFullYear()} LASPAD · Université Gaston Berger
              </Typography>
            </Box>

            {/* Footer links */}
            <Stack direction="row" spacing={3} flexWrap="wrap">
              {footerLinks.map((item) => (
                <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                  <Typography
                    sx={{
                      fontFamily: fontSans,
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      color: TOKEN.gray500,
                      letterSpacing: '0.01em',
                      transition: 'color 0.15s ease',
                      '&:hover': { color: TOKEN.gold },
                    }}
                  >
                    {item.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}