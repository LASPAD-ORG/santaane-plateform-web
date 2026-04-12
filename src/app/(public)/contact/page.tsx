'use client';

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Phone,
  Email,
  Send,
  Facebook,
  LinkedIn,
  YouTube,
  X as XIcon,
} from '@mui/icons-material';
import { useState } from 'react';

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
  '& .MuiOutlinedInput-input': { fontSize: '0.9rem' },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ bgcolor: TOKEN.offWhite, minHeight: 'calc(100vh - 200px)' }}>

      {/* ─── HERO ─── */}
      <Box
        sx={{
          bgcolor: TOKEN.black,
          color: TOKEN.white,
          py: { xs: 7, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.03) 40px)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-60px',
            left: '-80px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${TOKEN.gold}20 0%, transparent 70%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box sx={{ width: 48, height: 2, bgcolor: TOKEN.gold, mx: 'auto', mb: 3, borderRadius: 1 }} />
          <Typography
            variant="h3"
            fontWeight={700}
            gutterBottom
            sx={{
              fontFamily: fontSans,
              fontSize: { xs: '2rem', md: '2.8rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            Contactez-nous
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: fontSans,
              fontWeight: 300,
              color: TOKEN.gray300,
              maxWidth: 520,
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.7,
            }}
          >
            Une question ? Une suggestion ? N&apos;hésitez pas à nous écrire.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 3, md: 4 } }}>

          {/* ─── FORM ─── */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(60% - 16px)' } }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 2,
                border: `1px solid ${TOKEN.gray300}`,
                bgcolor: TOKEN.white,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{ width: 3, height: 24, bgcolor: TOKEN.gold, borderRadius: 2, flexShrink: 0 }} />
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ fontFamily: fontSans, letterSpacing: '-0.01em' }}
                >
                  Envoyez-nous un message
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: fontSans,
                  color: TOKEN.gray500,
                  fontSize: '0.875rem',
                  lineHeight: 1.7,
                  mb: 4,
                  pl: '19px',
                }}
              >
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
                    <TextField
                      sx={{ ...inputSx, flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)' } }}
                      required
                      label="Nom complet"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <TextField
                      sx={{ ...inputSx, flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)' } }}
                      required
                      type="email"
                      label="Adresse email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    sx={inputSx}
                    required
                    label="Objet"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    sx={inputSx}
                    required
                    multiline
                    rows={6}
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={<Send sx={{ fontSize: 16 }} />}
                    sx={{
                      alignSelf: 'flex-start',
                      fontFamily: fontSans,
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      bgcolor: TOKEN.black,
                      color: TOKEN.white,
                      borderRadius: 1,
                      px: 4,
                      py: 1.4,
                      boxShadow: 'none',
                      '&:hover': { bgcolor: TOKEN.gold, boxShadow: 'none' },
                      transition: 'background 0.2s ease',
                    }}
                  >
                    Envoyer le message
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Box>

          {/* ─── SIDEBAR ─── */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(40% - 16px)' } }}>
            <Stack spacing={3}>

              {/* Coordonnées */}
              <Paper
                elevation={0}
                sx={{
                  border: `1px solid ${TOKEN.gray300}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: TOKEN.white,
                }}
              >
                <Box sx={{ height: 3, bgcolor: TOKEN.black }} />
                <Box sx={{ p: { xs: 3, md: 3.5 } }}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      fontFamily: fontSans,
                      letterSpacing: '-0.01em',
                      fontSize: '1rem',
                      mb: 2.5,
                    }}
                  >
                    Coordonnées
                  </Typography>
                  <Divider sx={{ borderColor: TOKEN.gray100, mb: 2.5 }} />

                  <Stack spacing={3}>
                    {[
                      {
                        icon: <Phone sx={{ fontSize: 17 }} />,
                        label: 'Téléphone',
                        value: '+221 77 890 88 88',
                      },
                      {
                        icon: <Email sx={{ fontSize: 17 }} />,
                        label: 'Email',
                        value: 'communication@laspad.org',
                      },
                    ].map((item, i) => (
                      <Stack key={i} direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 1,
                            bgcolor: TOKEN.goldDim,
                            border: `1px solid ${TOKEN.gold}33`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: TOKEN.gold,
                            flexShrink: 0,
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: fontSans,
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: TOKEN.gray500,
                              mb: 0.25,
                            }}
                          >
                            {item.label}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: fontSans,
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              color: TOKEN.black,
                            }}
                          >
                            {item.value}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Paper>

              {/* Réseaux sociaux */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 3.5 },
                  border: `1px solid ${TOKEN.gray300}`,
                  borderRadius: 2,
                  bgcolor: TOKEN.white,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ fontFamily: fontSans, fontSize: '1rem', letterSpacing: '-0.01em', mb: 2.5 }}
                >
                  Suivez-nous
                </Typography>
                <Divider sx={{ borderColor: TOKEN.gray100, mb: 2.5 }} />

                <Stack direction="row" spacing={1.5} justifyContent="center">
                  {[
                    { icon: <Facebook sx={{ fontSize: 18 }} />, href: 'https://facebook.com/laspad', label: 'Facebook' },
                    { icon: <LinkedIn sx={{ fontSize: 18 }} />, href: 'https://linkedin.com/company/laspad', label: 'LinkedIn' },
                    { icon: <XIcon sx={{ fontSize: 18 }} />, href: 'https://twitter.com/laspad', label: 'X' },
                    { icon: <YouTube sx={{ fontSize: 18 }} />, href: 'https://www.youtube.com/@ugblaspad', label: 'YouTube' },
                  ].map((item, i) => (
                    <IconButton
                      key={i}
                      component="a"
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 1,
                        bgcolor: TOKEN.gray100,
                        color: TOKEN.gray700,
                        border: `1px solid ${TOKEN.gray300}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: TOKEN.black,
                          color: TOKEN.white,
                          borderColor: TOKEN.black,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      {item.icon}
                    </IconButton>
                  ))}
                </Stack>
              </Paper>

              {/* Newsletter */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 3.5 },
                  border: `1px solid ${TOKEN.gold}44`,
                  borderRadius: 2,
                  bgcolor: TOKEN.goldDim,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ fontFamily: fontSans, fontSize: '1rem', letterSpacing: '-0.01em', mb: 0.5 }}
                >
                  Newsletter
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fontSans,
                    color: TOKEN.gray500,
                    fontSize: '0.85rem',
                    lineHeight: 1.65,
                    mb: 2.5,
                  }}
                >
                  Abonnez-vous pour rester informé de nos actualités
                </Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    placeholder="votre@email.com"
                    type="email"
                    fullWidth
                    sx={{
                      ...inputSx,
                      '& .MuiOutlinedInput-root': {
                        ...inputSx['& .MuiOutlinedInput-root'],
                        bgcolor: TOKEN.white,
                        borderRadius: 1,
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      fontFamily: fontSans,
                      bgcolor: TOKEN.gold,
                      color: TOKEN.white,
                      borderRadius: 1,
                      minWidth: 'auto',
                      px: 2,
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#c9a440', boxShadow: 'none' },
                    }}
                  >
                    <Send sx={{ fontSize: 16 }} />
                  </Button>
                </Stack>
              </Paper>

            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}