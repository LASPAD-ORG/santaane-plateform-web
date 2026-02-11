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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: '#fafafa', minHeight: 'calc(100vh - 200px)' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
            Contactez-nous
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Une question ? Une suggestion ? N&apos;hésitez pas à nous écrire
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 3, md: 4 } }}>
          {/* Contact Form */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(60% - 16px)' } }}>
            <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                Envoyez-nous un message
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    required
                    label="Nom complet"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="Adresse email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    required
                    label="Objet"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
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
                    size="large"
                    endIcon={<Send />}
                    sx={{
                      alignSelf: 'flex-start',
                      px: 4,
                      py: 1.5,
                      bgcolor: '#ff9d00',
                      '&:hover': { bgcolor: '#e68a00' },
                    }}
                  >
                    Envoyer le message
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Box>

          {/* Contact Information */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(40% - 16px)' } }}>
            <Stack spacing={3}>
              {/* LASPAD Logo */}
            

              {/* Contact Details */}
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Coordonnées
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Stack spacing={2.5}>
                  {/* Phone */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: '#ff9d00',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Phone sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Téléphone
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        +221 77 890 88 88
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Email */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: '#59a498',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Email sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        contact@laspad.org
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>

              {/* Social Media */}
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Suivez-nous
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={1.5} justifyContent="center">
                  <IconButton
                    component="a"
                    href="https://facebook.com/laspad"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: '#1877F2',
                      color: 'white',
                      '&:hover': { bgcolor: '#145dbf' },
                    }}
                  >
                    <Facebook />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://linkedin.com/company/laspad"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: '#0A66C2',
                      color: 'white',
                      '&:hover': { bgcolor: '#084d8f' },
                    }}
                  >
                    <LinkedIn />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://twitter.com/laspad"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: '#000000',
                      color: 'white',
                      '&:hover': { bgcolor: '#333333' },
                    }}
                  >
                    <XIcon />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://www.youtube.com/@ugblaspad"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: '#FF0000',
                      color: 'white',
                      '&:hover': { bgcolor: '#cc0000' },
                    }}
                  >
                    <YouTube />
                  </IconButton>
                </Stack>
              </Paper>

              {/* Newsletter */}
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#fff7ed' }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Newsletter
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Abonnez-vous pour rester informé de nos actualités
                </Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    placeholder="Votre email"
                    type="email"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#ff9d00',
                      '&:hover': { bgcolor: '#e68a00' },
                      minWidth: 'auto',
                      px: 2,
                    }}
                  >
                    <Send fontSize="small" />
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
