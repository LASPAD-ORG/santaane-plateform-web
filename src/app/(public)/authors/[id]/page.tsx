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
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import {
  ArrowBack,
  CalendarMonth,
  Category,
  Business,
  Work,
  Article,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { publicApiService, PublicAuthorDetail } from '@/services/publicApiService';

// ─── Design tokens (identiques à la charte) ───
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

export default function AuthorProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [author, setAuthor] = useState<PublicAuthorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const data = await publicApiService.getAuthorProfile(parseInt(id));
        setAuthor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '…';
  };

  // ─── Loading ───
  if (loading) {
    return (
      <Box sx={{ bgcolor: TOKEN.offWhite, minHeight: '100vh', py: 5 }}>
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" height={40} width={120} sx={{ mb: 5, borderRadius: 1 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(33.333% - 16px)' } }}>
              <Skeleton variant="rectangular" height={360} sx={{ borderRadius: 2 }} />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.666% - 16px)' } }}>
              <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} />
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  // ─── Error ───
  if (error || !author) {
    return (
      <Box sx={{ bgcolor: TOKEN.offWhite, minHeight: '100vh', py: 5 }}>
        <Container maxWidth="lg">
          <Alert
            severity="error"
            sx={{
              mb: 3,
              fontFamily: fontSans,
              borderRadius: 2,
              border: `1px solid rgba(0,0,0,0.12)`,
            }}
          >
            {error || 'Auteur non trouvé'}
          </Alert>
          <Button
            startIcon={<ArrowBack sx={{ fontSize: 16 }} />}
            onClick={() => router.back()}
            sx={{
              fontFamily: fontSans,
              fontWeight: 600,
              fontSize: '0.8rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: TOKEN.black,
              '&:hover': { bgcolor: TOKEN.gray100 },
            }}
          >
            Retour
          </Button>
        </Container>
      </Box>
    );
  }

  // ─── Page ───
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
            Retour
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'flex-start' }}>

          {/* ─── PROFILE CARD ─── */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(33.333% - 16px)' } }}>
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${TOKEN.gray300}`,
                borderRadius: 2,
                overflow: 'hidden',
                position: { md: 'sticky' },
                top: { md: 24 },
                bgcolor: TOKEN.white,
              }}
            >
              {/* Top accent stripe */}
              <Box sx={{ height: 3, bgcolor: TOKEN.black }} />

              <Box sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
                {/* Avatar */}
                <Avatar
                  sx={{
                    width: 88,
                    height: 88,
                    mx: 'auto',
                    mb: 2.5,
                    bgcolor: TOKEN.black,
                    color: TOKEN.white,
                    fontSize: '2rem',
                    fontFamily: fontSans,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {author.fullName.charAt(0)}
                </Avatar>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                  sx={{
                    fontFamily: fontSans,
                    fontSize: '1.15rem',
                    letterSpacing: '-0.01em',
                    color: TOKEN.black,
                  }}
                >
                  {author.fullName}
                </Typography>

                {author.position && (
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 0.5 }}>
                    <Work sx={{ fontSize: 14, color: TOKEN.gray500 }} />
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: fontSans, fontSize: '0.85rem', color: TOKEN.gray500 }}
                    >
                      {author.position}
                    </Typography>
                  </Stack>
                )}

                {author.institution && (
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 0 }}>
                    <Business sx={{ fontSize: 14, color: TOKEN.gray500 }} />
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: fontSans, fontSize: '0.85rem', color: TOKEN.gray500 }}
                    >
                      {author.institution}
                    </Typography>
                  </Stack>
                )}
              </Box>

              <Divider sx={{ borderColor: TOKEN.gray100 }} />

              {/* Stats block */}
              <Box
                sx={{
                  px: 4,
                  py: 3,
                  textAlign: 'center',
                  bgcolor: TOKEN.goldDim,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: fontSans,
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    color: TOKEN.black,
                    lineHeight: 1,
                    mb: 0.5,
                  }}
                >
                  {author.publicationsCount}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fontSans,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: TOKEN.gray500,
                  }}
                >
                  Publication{author.publicationsCount !== 1 ? 's' : ''}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: TOKEN.gray100 }} />

              {/* Meta fields */}
              <Box sx={{ px: 4, py: 3 }}>
                {author.orcidId && (
                  <Box sx={{ mb: 2.5 }}>
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
                      ORCID
                    </Typography>
                    <a
                      href={`https://orcid.org/${author.orcidId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: fontSans,
                          fontSize: '0.85rem',
                          color: TOKEN.gold,
                          fontWeight: 500,
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {author.orcidId}
                      </Typography>
                    </a>
                  </Box>
                )}

                {author.bio && (
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: fontSans,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: TOKEN.gray500,
                        mb: 0.75,
                      }}
                    >
                      Biographie
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: fontSans,
                        color: TOKEN.gray700,
                        lineHeight: 1.75,
                        fontSize: '0.875rem',
                      }}
                    >
                      {author.bio}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>

          {/* ─── PUBLICATIONS ─── */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.666% - 16px)' } }}>

            {/* Section header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ width: 3, height: 28, bgcolor: TOKEN.gold, borderRadius: 2, flexShrink: 0 }} />
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  fontFamily: fontSans,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.2rem', md: '1.4rem' },
                }}
              >
                Publications
              </Typography>
              <Box sx={{ flex: 1, height: 1, bgcolor: TOKEN.gray300 }} />
              <Typography
                sx={{
                  fontFamily: fontSans,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: TOKEN.gray500,
                  flexShrink: 0,
                }}
              >
                {author.manuscripts.length} résultat{author.manuscripts.length > 1 ? 's' : ''}
              </Typography>
            </Box>

            {author.manuscripts.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 6, md: 8 },
                  textAlign: 'center',
                  border: `1px dashed ${TOKEN.gray300}`,
                  borderRadius: 2,
                  bgcolor: TOKEN.white,
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: TOKEN.gray100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2.5,
                  }}
                >
                  <Article sx={{ fontSize: 28, color: TOKEN.gray500 }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: fontSans,
                    color: TOKEN.gray500,
                    fontSize: '0.95rem',
                  }}
                >
                  Aucune publication disponible
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={3}>
                {author.manuscripts.map((manuscript, idx) => (
                  <Card
                    key={manuscript.id}
                    elevation={0}
                    sx={{
                      border: `1px solid ${TOKEN.gray300}`,
                      borderRadius: 2,
                      bgcolor: TOKEN.white,
                      transition: 'all 0.25s ease',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: TOKEN.black,
                        boxShadow: `0 8px 28px rgba(0,0,0,0.07)`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardActionArea component={Link} href={`/manuscripts/${manuscript.id}`}>
                      <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                        {/* Top row: index + chips */}
                        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
                          <Typography
                            sx={{
                              fontFamily: fontSans,
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: TOKEN.gray500,
                            }}
                          >
                            N° {String(idx + 1).padStart(2, '0')}
                          </Typography>

                          <Stack direction="row" spacing={0.75} flexWrap="wrap" justifyContent="flex-end" gap={0.5}>
                            {manuscript.themeName && (
                              <Chip
                                size="small"
                                label={manuscript.themeName}
                                icon={<Category sx={{ fontSize: '11px !important' }} />}
                                sx={{
                                  fontFamily: fontSans,
                                  fontSize: '0.68rem',
                                  height: 20,
                                  bgcolor: TOKEN.goldDim,
                                  border: `1px solid ${TOKEN.gold}44`,
                                  color: TOKEN.gray700,
                                  '& .MuiChip-icon': { color: TOKEN.gold },
                                }}
                              />
                            )}
                            <Chip
                              size="small"
                              label={manuscript.sectionName}
                              sx={{
                                fontFamily: fontSans,
                                fontSize: '0.68rem',
                                height: 20,
                                bgcolor: TOKEN.gray100,
                                border: `1px solid ${TOKEN.gray300}`,
                                color: TOKEN.gray700,
                              }}
                            />
                          </Stack>
                        </Stack>

                        {/* Title */}
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          gutterBottom
                          sx={{
                            fontFamily: fontSans,
                            fontSize: { xs: '0.95rem', md: '1.05rem' },
                            letterSpacing: '-0.01em',
                            lineHeight: 1.45,
                            color: TOKEN.black,
                          }}
                        >
                          {manuscript.title}
                        </Typography>

                        {/* Abstract */}
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: fontSans,
                            color: TOKEN.gray500,
                            lineHeight: 1.75,
                            fontSize: '0.875rem',
                            mb: 2.5,
                          }}
                        >
                          {truncateText(manuscript.abstract, 200)}
                        </Typography>

                        {/* Keywords */}
                        {manuscript.keywords && (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mb: 2.5 }}>
                            {manuscript.keywords
                              .split(',')
                              .slice(0, 4)
                              .map((keyword, ki) => (
                                <Chip
                                  key={ki}
                                  label={keyword.trim()}
                                  size="small"
                                  sx={{
                                    fontFamily: fontSans,
                                    fontSize: '0.68rem',
                                    height: 20,
                                    bgcolor: 'transparent',
                                    border: `1px solid ${TOKEN.gray300}`,
                                    color: TOKEN.gray700,
                                  }}
                                />
                              ))}
                          </Stack>
                        )}

                        {/* Date */}
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                          <CalendarMonth sx={{ fontSize: 14, color: TOKEN.gray300 }} />
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: fontSans,
                              fontSize: '0.75rem',
                              color: TOKEN.gray500,
                              letterSpacing: '0.01em',
                            }}
                          >
                            {formatDate(manuscript.publishedAt || manuscript.createdAt)}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}