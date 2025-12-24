'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Chip,
  Stack,
  List,
  ListItem,
  IconButton,
  Divider,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Send,
  Delete as DeleteIcon,
  ThumbUp,
  ThumbDown,
  HelpOutline,
  Lightbulb,
} from '@mui/icons-material';
import type { EvaluatorHighlight } from '@/types/evaluator';

// Chargement dynamique pour éviter les erreurs SSR avec pdfjs
const PdfAnnotator = dynamic(() => import('./components'), {
  ssr: false,
  loading: () => (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
      <CircularProgress />
    </Box>
  ),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const categoryIcons = {
  positive: <ThumbUp fontSize="small" />,
  negative: <ThumbDown fontSize="small" />,
  question: <HelpOutline fontSize="small" />,
  suggestion: <Lightbulb fontSize="small" />,
};

const categoryColors = {
  positive: '#4caf50',
  negative: '#f44336',
  question: '#2196f3',
  suggestion: '#ff9800',
};

// Fonction utilitaire pour obtenir les cookies
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export default function EvaluateManuscriptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const manuscriptId = resolvedParams.id;

  const [manuscript, setManuscript] = useState<any>(null);
  const [highlights, setHighlights] = useState<EvaluatorHighlight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authToken, setAuthToken] = useState<string>('');

  useEffect(() => {
    const token = getCookie('auth_token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    fetchManuscript();
  }, [manuscriptId]);

  const fetchManuscript = async () => {
    try {
      const response = await fetch('/api/evaluator/manuscripts');
      if (!response.ok) throw new Error('Erreur lors du chargement');

      const data = await response.json();
      const found = data.find((m: any) => m.id === parseInt(manuscriptId));

      if (!found) {
        setError('Manuscrit non trouvé');
        return;
      }

      setManuscript(found);
    } catch (err) {
      setError('Impossible de charger le manuscrit');
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!manuscript?.pdfFilename) return;

    const downloadUrl = `${API_URL}/api/v1/files/download/${manuscript.pdfFilename}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = manuscript.pdfFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitEvaluation = async () => {
    if (highlights.length === 0) {
      setError('Veuillez ajouter au moins un commentaire');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implémenter l'envoi de l'évaluation au backend
      console.log('Soumission de l\'évaluation:', {
        manuscriptId,
        highlights: highlights.map(h => ({
          type: h.type,
          comment: h.comment,
          category: h.category,
          position: h.position,
        })),
      });

      // Simuler l'envoi
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Évaluation soumise avec succès !');
      router.push('/dashboard/evaluator/manuscripts');
    } catch (err) {
      setError('Erreur lors de la soumission');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  if (error && !manuscript) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/dashboard/evaluator/manuscripts')}
          sx={{ mt: 2 }}
        >
          Retour
        </Button>
      </Box>
    );
  }

  if (!manuscript) {
    return (
      <Box p={3}>
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  const pdfUrl = `${API_URL}/api/v1/files/view/${manuscript.pdfFilename}`;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* En-tête */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={() => router.push('/dashboard/evaluator/manuscripts')}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h6" gutterBottom>
                {manuscript.title}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip label={manuscript.themeName} size="small" />
                <Chip label={manuscript.sectionName} size="small" />
                <Chip label={manuscript.languageName} size="small" variant="outlined" />
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Télécharger le PDF">
              <IconButton onClick={handleDownload} color="primary">
                <Download />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={handleSubmitEvaluation}
              disabled={isSubmitting || highlights.length === 0}
            >
              {isSubmitting ? 'Envoi...' : 'Soumettre l\'évaluation'}
            </Button>
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* Contenu principal - Layout en 2 colonnes */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* PDF Viewer - 70% */}
        <Box sx={{ width: '70%', height: '100%', borderRight: '1px solid', borderColor: 'divider' }}>
          <PdfAnnotator
            pdfUrl={pdfUrl}
            initialHighlights={highlights}
            onHighlightsChange={setHighlights}
            authToken={authToken}
          />
        </Box>

        {/* Panneau de commentaires - 30% */}
        <Paper
          elevation={0}
          sx={{
            width: '30%',
            height: '100%',
            overflow: 'auto',
            p: 2,
            borderRadius: 0,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Commentaires ({highlights.length})
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            Sélectionnez du texte ou maintenez Alt et faites glisser pour créer une zone
            d&apos;annotation.
          </Typography>

          <Divider sx={{ my: 2 }} />

          {highlights.length === 0 ? (
            <Alert severity="info">
              Aucun commentaire pour le moment. Commencez à annoter le PDF !
            </Alert>
          ) : (
            <List>
              {highlights.map((highlight, index) => (
                <React.Fragment key={highlight.id}>
                  <ListItem
                    sx={{
                      display: 'block',
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      mb: 1,
                      borderLeft: `4px solid ${
                        highlight.category
                          ? categoryColors[highlight.category]
                          : '#999'
                      }`,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                          {highlight.category && categoryIcons[highlight.category]}
                          <Chip
                            label={highlight.category || 'général'}
                            size="small"
                            sx={{
                              bgcolor: highlight.category
                                ? categoryColors[highlight.category]
                                : '#999',
                              color: 'white',
                            }}
                          />
                        </Stack>

                        <Typography variant="body2" paragraph>
                          {highlight.comment}
                        </Typography>

                        {highlight.content?.text && (
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 1,
                              bgcolor: 'grey.50',
                              borderLeft: '3px solid',
                              borderColor: 'primary.main',
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              Texte sélectionné:
                            </Typography>
                            <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                              &quot;{highlight.content.text.substring(0, 100)}
                              {highlight.content.text.length > 100 ? '...' : ''}&quot;
                            </Typography>
                          </Paper>
                        )}
                      </Box>

                      <IconButton
                        size="small"
                        onClick={() => handleDeleteHighlight(highlight.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </ListItem>
                  {index < highlights.length - 1 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
