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
  Person,
  CalendarMonth,
  Category,
  Email,
  Business,
  Work,
  Article,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { publicApiService, PublicAuthorDetail } from '@/services/publicApiService';

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
    return text.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 4, borderRadius: 2 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 21px)' } }}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.666% - 11px)' } }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (error || !author) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Auteur non trouvé'}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => router.back()}>
          Retour
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.back()}
        sx={{ mb: 3 }}
        color="inherit"
      >
        Retour
      </Button>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {/* Author Profile Card */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 21px)' } }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              textAlign: 'center',
              position: 'sticky',
              top: 100,
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: 40,
              }}
            >
              {author.fullName.charAt(0)}
            </Avatar>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {author.fullName}
            </Typography>

            {author.position && (
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 1 }}>
                <Work sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {author.position}
                </Typography>
              </Stack>
            )}

            {author.institution && (
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                <Business sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {author.institution}
                </Typography>
              </Stack>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Stats */}
            <Box sx={{ py: 2 }}>
              <Typography variant="h3" fontWeight="bold" color="primary.main">
                {author.publicationsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Publication{author.publicationsCount !== 1 ? 's' : ''}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* ORCID */}
            {author.orcidId && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  ORCID
                </Typography>
                <a
                  href={`https://orcid.org/${author.orcidId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2563EB', textDecoration: 'none' }}
                >
                  <Typography variant="body2">{author.orcidId}</Typography>
                </a>
              </Box>
            )}

            {/* Bio */}
            {author.bio && (
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Biographie
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {author.bio}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Publications */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.666% - 11px)' } }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            Publications
          </Typography>

          {author.manuscripts.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Article sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography color="text.secondary">
                Aucune publication disponible
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={3}>
              {author.manuscripts.map((manuscript) => (
                <Card
                  key={manuscript.id}
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
                    },
                  }}
                >
                  <CardActionArea component={Link} href={`/manuscripts/${manuscript.id}`}>
                    <CardContent sx={{ p: 3 }}>
                      {/* Categories */}
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" gap={0.5}>
                        {manuscript.themeName && (
                          <Chip
                            size="small"
                            label={manuscript.themeName}
                            icon={<Category sx={{ fontSize: 14 }} />}
                            sx={{ fontSize: 11 }}
                          />
                        )}
                        <Chip
                          size="small"
                          label={manuscript.sectionName}
                          variant="outlined"
                          sx={{ fontSize: 11 }}
                        />
                      </Stack>

                      {/* Title */}
                      <Typography variant="h6" fontWeight="600" gutterBottom>
                        {manuscript.title}
                      </Typography>

                      {/* Abstract */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, lineHeight: 1.6 }}
                      >
                        {truncateText(manuscript.abstract, 200)}
                      </Typography>

                      {/* Keywords */}
                      {manuscript.keywords && (
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
                          {manuscript.keywords.split(',').slice(0, 4).map((keyword, idx) => (
                            <Chip
                              key={idx}
                              label={keyword.trim()}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: 10, height: 22 }}
                            />
                          ))}
                        </Stack>
                      )}

                      {/* Date */}
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <CalendarMonth sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.disabled">
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
  );
}
