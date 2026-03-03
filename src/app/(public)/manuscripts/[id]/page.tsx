'use client';

import { useState, useEffect, use } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Stack,
  Skeleton,
  Button,
  Divider,
  Avatar,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  CalendarMonth,
  Category,
  Language,
  Download,
  LocalLibrary,
  PictureAsPdf,
  Fullscreen,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { publicApiService, PublicManuscriptDetail } from '@/services/publicApiService';

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ManuscriptDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [manuscript, setManuscript] = useState<PublicManuscriptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManuscript = async () => {
      try {
        const data = await publicApiService.getManuscriptDetail(parseInt(id));
        setManuscript(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchManuscript();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // ─── Loading ───
  if (loading) {
    return (
      <Box sx={{ bgcolor: TOKEN.offWhite, minHeight: '100vh', py: 5 }}>
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" height={40} width={120} sx={{ mb: 5, borderRadius: 1 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.666% - 16px)' } }}>
              <Skeleton variant="rectangular" height={480} sx={{ borderRadius: 2 }} />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(33.333% - 16px)' } }}>
              <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  // ─── Error ───
  if (error || !manuscript) {
    return (
      <Box sx={{ bgcolor: TOKEN.offWhite, minHeight: '100vh', py: 5 }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 3, fontFamily: fontSans, borderRadius: 2 }}>
            {error || 'Manuscrit non trouvé'}
          </Alert>
          <Button
            startIcon={<ArrowBack sx={{ fontSize: 15 }} />}
            onClick={() => router.back()}
            sx={{
              fontFamily: fontSans,
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: TOKEN.black,
            }}
          >
            Retour
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: TOKEN.offWhite, minHeight: '100vh' }}>

      {/* ─── TOP BAR ─── */}
      <Box sx={{ bgcolor: TOKEN.black, py: 2 }}>
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBack sx={{ fontSize: 15 }} />}
            onClick={() => router.back()}
            sx={{
              fontFamily: fontSans,
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: TOKEN.white,
              opacity: 0.7,
              '&:hover': { opacity: 1, bgcolor: 'transparent' },
            }}
          >
            Retour aux publications
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'flex-start' }}>

          {/* ─── MAIN CONTENT ─── */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.666% - 16px)' } }}>
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
              <Box sx={{ p: { xs: 3, md: 5 } }}>

                {/* Chips */}
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
                  {manuscript.themeName && (
                    <Chip
                      icon={<Category sx={{ fontSize: '13px !important' }} />}
                      label={manuscript.themeName}
                      size="small"
                      sx={{
                        fontFamily: fontSans,
                        fontSize: '0.7rem',
                        height: 24,
                        bgcolor: TOKEN.goldDim,
                        border: `1px solid ${TOKEN.gold}44`,
                        color: TOKEN.gray700,
                        '& .MuiChip-icon': { color: TOKEN.gold },
                      }}
                    />
                  )}
                  <Chip
                    icon={<LocalLibrary sx={{ fontSize: '13px !important' }} />}
                    label={manuscript.sectionName}
                    size="small"
                    sx={{
                      fontFamily: fontSans,
                      fontSize: '0.7rem',
                      height: 24,
                      bgcolor: TOKEN.gray100,
                      border: `1px solid ${TOKEN.gray300}`,
                      color: TOKEN.gray700,
                      '& .MuiChip-icon': { color: TOKEN.gray500 },
                    }}
                  />
                  <Chip
                    icon={<Language sx={{ fontSize: '13px !important' }} />}
                    label={manuscript.languageName}
                    size="small"
                    sx={{
                      fontFamily: fontSans,
                      fontSize: '0.7rem',
                      height: 24,
                      bgcolor: TOKEN.gray100,
                      border: `1px solid ${TOKEN.gray300}`,
                      color: TOKEN.gray700,
                      '& .MuiChip-icon': { color: TOKEN.gray500 },
                    }}
                  />
                </Stack>

                {/* Title */}
                <Typography
                  variant="h4"
                  fontWeight={800}
                  gutterBottom
                  sx={{
                    fontFamily: fontSans,
                    fontSize: { xs: '1.4rem', md: '1.75rem' },
                    letterSpacing: '-0.02em',
                    lineHeight: 1.3,
                    color: TOKEN.black,
                    mb: 2,
                  }}
                >
                  {manuscript.title}
                </Typography>

                {/* Date */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
                  <CalendarMonth sx={{ fontSize: 15, color: TOKEN.gray500 }} />
                  <Typography
                    sx={{
                      fontFamily: fontSans,
                      fontSize: '0.8rem',
                      color: TOKEN.gray500,
                      letterSpacing: '0.01em',
                    }}
                  >
                    Publié le {formatDate(manuscript.publishedAt || manuscript.createdAt)}
                  </Typography>
                </Stack>

                <Divider sx={{ borderColor: TOKEN.gray100, mb: 4 }} />

                {/* Abstract */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    sx={{
                      fontFamily: fontSans,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: TOKEN.gold,
                      mb: 1.5,
                    }}
                  >
                    Résumé
                  </Typography>
                  <Box sx={{ borderLeft: `2px solid ${TOKEN.gold}55`, pl: 3 }}>
                    <Typography
                      sx={{
                        fontFamily: fontSans,
                        fontSize: { xs: '0.9rem', md: '0.95rem' },
                        color: TOKEN.gray700,
                        lineHeight: 1.85,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {manuscript.abstract || 'Aucun résumé disponible'}
                    </Typography>
                  </Box>
                </Box>

                {/* Keywords */}
                {manuscript.keywords && (
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: fontSans,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: TOKEN.gray500,
                        mb: 1.5,
                      }}
                    >
                      Mots-clés
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {manuscript.keywords.split(',').map((keyword, idx) => (
                        <Chip
                          key={idx}
                          label={keyword.trim()}
                          size="small"
                          sx={{
                            fontFamily: fontSans,
                            fontSize: '0.75rem',
                            height: 26,
                            borderRadius: '4px',
                            bgcolor: 'transparent',
                            border: `1px solid ${TOKEN.gray300}`,
                            color: TOKEN.gray700,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>

          {/* ─── SIDEBAR ─── */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(33.333% - 16px)' } }}>
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${TOKEN.gray300}`,
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: TOKEN.white,
                position: { md: 'sticky' },
                top: { md: 24 },
              }}
            >
              <Box sx={{ height: 3, bgcolor: TOKEN.black }} />
              <Box sx={{ p: { xs: 3, md: 3.5 } }}>

                <Typography
                  sx={{
                    fontFamily: fontSans,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: TOKEN.gray500,
                    mb: 2.5,
                  }}
                >
                  À propos de l&apos;auteur
                </Typography>

                {/* Author card */}
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2.5 }}>
                  <Avatar
                    sx={{
                      bgcolor: TOKEN.black,
                      color: TOKEN.white,
                      width: 46,
                      height: 46,
                      fontFamily: fontSans,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      flexShrink: 0,
                    }}
                  >
                    {manuscript.author.fullName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: fontSans,
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: TOKEN.black,
                        lineHeight: 1.3,
                      }}
                    >
                      {manuscript.author.fullName}
                    </Typography>
                    {manuscript.author.position && (
                      <Typography
                        sx={{
                          fontFamily: fontSans,
                          fontSize: '0.78rem',
                          color: TOKEN.gray500,
                          lineHeight: 1.4,
                        }}
                      >
                        {manuscript.author.position}
                      </Typography>
                    )}
                  </Box>
                </Stack>

                <Divider sx={{ borderColor: TOKEN.gray100, mb: 2 }} />

                {manuscript.author.institution && (
                  <Box sx={{ mb: 1.5 }}>
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
                      Institution
                    </Typography>
                    <Typography sx={{ fontFamily: fontSans, fontSize: '0.85rem', color: TOKEN.gray700 }}>
                      {manuscript.author.institution}
                    </Typography>
                  </Box>
                )}

                {manuscript.author.orcidId && (
                  <Box sx={{ mb: 1.5 }}>
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
                      ORCID
                    </Typography>
                    <a
                      href={`https://orcid.org/${manuscript.author.orcidId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                    >
                      <Typography
                        sx={{
                          fontFamily: fontSans,
                          fontSize: '0.85rem',
                          color: TOKEN.gold,
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {manuscript.author.orcidId}
                      </Typography>
                    </a>
                  </Box>
                )}

                {manuscript.author.bio && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{
                        fontFamily: fontSans,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: TOKEN.gray500,
                        mb: 0.5,
                      }}
                    >
                      Biographie
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: fontSans,
                        fontSize: '0.82rem',
                        color: TOKEN.gray500,
                        lineHeight: 1.7,
                      }}
                    >
                      {manuscript.author.bio}
                    </Typography>
                  </Box>
                )}

                <Button
                  fullWidth
                  component={Link}
                  href={`/authors/${manuscript.author.id}`}
                  startIcon={<Person sx={{ fontSize: 16 }} />}
                  sx={{
                    fontFamily: fontSans,
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    borderColor: TOKEN.black,
                    color: TOKEN.black,
                    borderRadius: 1,
                    py: 1.2,
                    border: `1px solid ${TOKEN.black}`,
                    '&:hover': { bgcolor: TOKEN.black, color: TOKEN.white },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Voir le profil
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* ─── PDF VIEWER ─── */}
        {manuscript.pdfFilename && (
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              border: `1px solid ${TOKEN.gray300}`,
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: TOKEN.white,
            }}
          >
            <Box sx={{ height: 3, bgcolor: TOKEN.black }} />
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={2}
                sx={{ mb: 3 }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: 1,
                      bgcolor: TOKEN.goldDim,
                      border: `1px solid ${TOKEN.gold}33`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PictureAsPdf sx={{ fontSize: 18, color: TOKEN.gold }} />
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ fontFamily: fontSans, fontSize: '1rem', letterSpacing: '-0.01em' }}
                  >
                    Prévisualisation du document
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                  <Button
                    size="small"
                    startIcon={<Download sx={{ fontSize: 15 }} />}
                    href={`${API_URL}/api/v1/files/view/${manuscript.pdfFilename}`}
                    target="_blank"
                    sx={{
                      fontFamily: fontSans,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      borderColor: TOKEN.gray300,
                      color: TOKEN.gray700,
                      borderRadius: 1,
                      border: `1px solid ${TOKEN.gray300}`,
                      '&:hover': { borderColor: TOKEN.black, color: TOKEN.black },
                    }}
                  >
                    Télécharger
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Fullscreen sx={{ fontSize: 15 }} />}
                    href={`${API_URL}/api/v1/files/view/${manuscript.pdfFilename}`}
                    target="_blank"
                    sx={{
                      fontFamily: fontSans,
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      bgcolor: TOKEN.black,
                      color: TOKEN.white,
                      borderRadius: 1,
                      border: `1px solid ${TOKEN.black}`,
                      '&:hover': { bgcolor: TOKEN.gold, borderColor: TOKEN.gold },
                      boxShadow: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Plein écran
                  </Button>
                </Stack>
              </Stack>

              <Box
                sx={{
                  bgcolor: TOKEN.gray100,
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: `1px solid ${TOKEN.gray300}`,
                }}
              >
                <iframe
                  src={`${API_URL}/api/v1/files/view/${manuscript.pdfFilename}#toolbar=1&navpanes=1&scrollbar=1`}
                  style={{ width: '100%', height: '800px', border: 'none', display: 'block' }}
                  title={`PDF - ${manuscript.title}`}
                />
              </Box>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
}