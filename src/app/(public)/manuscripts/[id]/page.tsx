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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 4, borderRadius: 2 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.666% - 21px)' } }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 11px)' } }}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (error || !manuscript) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Manuscrit non trouvé'}
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
        Retour aux publications
      </Button>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {/* Main Content */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.666% - 21px)' } }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            {/* Categories */}
            <Stack direction="row" spacing={1} sx={{ mb: 3 }} flexWrap="wrap" gap={1}>
              {manuscript.themeName && (
                <Chip
                  icon={<Category sx={{ fontSize: 16 }} />}
                  label={manuscript.themeName}
                  color="primary"
                  variant="outlined"
                />
              )}
              <Chip
                icon={<LocalLibrary sx={{ fontSize: 16 }} />}
                label={manuscript.sectionName}
                variant="outlined"
              />
              <Chip
                icon={<Language sx={{ fontSize: 16 }} />}
                label={manuscript.languageName}
                variant="outlined"
              />
            </Stack>

            {/* Title */}
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.3 }}>
              {manuscript.title}
            </Typography>

      

            {/* Publication date */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
              <CalendarMonth sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Publié le {formatDate(manuscript.publishedAt || manuscript.createdAt)}
              </Typography>
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Abstract */}
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Résumé
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', mb: 4 }}
            >
              {manuscript.abstract || 'Aucun résumé disponible'}
            </Typography>

            {/* Keywords */}
            {manuscript.keywords && (
              <>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Mots-clés
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {manuscript.keywords.split(',').map((keyword, idx) => (
                    <Chip
                      key={idx}
                      label={keyword.trim()}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 1 }}
                    />
                  ))}
                </Stack>
              </>
            )}
          </Paper>
        </Box>

        {/* Sidebar */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 11px)' } }}>


          {/* Author Info */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              À propos de l&apos;auteur
            </Typography>

              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  transition: 'background 0.2s',
                  mb: 2,
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                  {manuscript.author.fullName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="600" color="text.primary">
                    {manuscript.author.fullName}
                  </Typography>
                  {manuscript.author.position && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {manuscript.author.position}
                    </Typography>
                  )}
                </Box>
              </Stack>

            {manuscript.author.institution && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Institution:</strong> {manuscript.author.institution}
              </Typography>
            )}

            {manuscript.author.orcidId && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>ORCID:</strong>{' '}
                <a
                  href={`https://orcid.org/${manuscript.author.orcidId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2563EB' }}
                >
                  {manuscript.author.orcidId}
                </a>
              </Typography>
            )}

            {manuscript.author.bio && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {manuscript.author.bio}
              </Typography>
            )}

            <Button
              fullWidth
              variant="outlined"
              component={Link}
              href={`/authors/${manuscript.author.id}`}
              sx={{ mt: 2, borderRadius: 2 }}
              startIcon={<Person />}
            >
              Voir le profil
            </Button>
          </Paper>
        </Box>
      </Box>

      {/* PDF Viewer Section */}
      {manuscript.pdfFilename && (
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PictureAsPdf sx={{ color: '#ff9d00' }} />
              <Typography variant="h6" fontWeight="600">
                Prévisualisation du document
              </Typography>
            </Stack>

            {/* PDF Controls */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Download />}
                href={`${API_URL}/api/v1/files/view/${manuscript.pdfFilename}`}
                target="_blank"
                sx={{ borderRadius: 2 }}
              >
                Télécharger
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<Fullscreen />}
                href={`${API_URL}/api/v1/files/view/${manuscript.pdfFilename}`}
                target="_blank"
                sx={{ 
                  borderRadius: 2,
                  bgcolor: '#ff9d00',
                  '&:hover': { bgcolor: '#e68a00' }
                }}
              >
                Plein écran
              </Button>
            </Stack>
          </Stack>

          {/* PDF Document via iframe */}
          <Box
            sx={{
              bgcolor: '#f5f5f5',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <iframe
              src={`${API_URL}/api/v1/files/view/${manuscript.pdfFilename}#toolbar=1&navpanes=1&scrollbar=1`}
              style={{
                width: '100%',
                height: '800px',
                border: 'none',
              }}
              title={`PDF - ${manuscript.title}`}
            />
          </Box>
        </Paper>
      )}
    </Container>
  );
}
