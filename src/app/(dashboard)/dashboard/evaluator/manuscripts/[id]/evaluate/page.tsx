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
  IconButton,
  Tooltip,
  CircularProgress,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Send,
  MenuOpen,
  Menu,
  Assignment,
} from '@mui/icons-material';
import type { EvaluatorHighlight } from '@/types/evaluator';
import { CommentsSidebar } from './components/CommentsSidebar';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';
import { PdfZoomControls } from './components/PdfZoomControls';
import { EvaluationGridDialog } from './components/EvaluationGridDialog';
import { useAnnotations } from './hooks/useAnnotations';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [manuscript, setManuscript] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authToken, setAuthToken] = useState<string>('');
  const [highlightToDelete, setHighlightToDelete] = useState<string | null>(null);
  const [pdfScaleValue, setPdfScaleValue] = useState<number | string>('auto');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [evaluationGridOpen, setEvaluationGridOpen] = useState(false);
  const highlighterUtilsRef = React.useRef<any>(null);

  // Hook pour gérer la persistance des annotations
  const {
    highlights,
    loading: loadingAnnotations,
    saving: savingAnnotations,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
  } = useAnnotations({ manuscriptId: parseInt(manuscriptId) });

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
    setHighlightToDelete(id);
  };

  const confirmDelete = async () => {
    if (highlightToDelete) {
      await deleteAnnotation(highlightToDelete);
      setHighlightToDelete(null);
    }
  };

  const handleHighlightClick = (highlightId: string) => {
    const highlight = highlights.find((h) => h.id === highlightId);
    if (highlight && highlighterUtilsRef.current) {
      // Fermer la sidebar sur mobile après clic
      if (isMobile) {
        setSidebarOpen(false);
      }
      highlighterUtilsRef.current.scrollToHighlight(highlight);
    }
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

  if (!manuscript || loadingAnnotations) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress />
        <Typography ml={2}>
          {!manuscript ? 'Chargement du manuscrit...' : 'Chargement des annotations...'}
        </Typography>
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
          p: { xs: 1.5, sm: 2 },
          borderRadius: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={{ xs: 1, sm: 0 }}
        >
          <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }}>
            <IconButton onClick={() => router.push('/dashboard/evaluator/manuscripts')}>
              <ArrowBack />
            </IconButton>
            <Box flex={1}>
              <Typography variant={{ xs: 'subtitle1', sm: 'h6' }} gutterBottom>
                {manuscript.title}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={manuscript.themeName} size="small" />
                <Chip label={manuscript.sectionName} size="small" />
                <Chip label={manuscript.languageName} size="small" variant="outlined" />
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-end', sm: 'flex-start' }} alignItems="center">
            {savingAnnotations && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  Sauvegarde...
                </Typography>
              </Stack>
            )}
            <Tooltip title="Télécharger le PDF">
              <IconButton onClick={handleDownload} color="primary">
                <Download />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<Assignment />}
              onClick={() => setEvaluationGridOpen(true)}
            >
              Grille d&apos;évaluation
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
        {/* PDF Viewer */}
        <Box
          sx={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          {/* Contrôles de zoom et toggle sidebar */}
          <Box sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <PdfZoomControls
              currentZoom={pdfScaleValue}
              onZoomChange={setPdfScaleValue}
            />

            <Tooltip title={sidebarOpen ? 'Masquer les commentaires' : 'Afficher les commentaires'}>
              <IconButton
                onClick={() => setSidebarOpen(!sidebarOpen)}
                color="primary"
                sx={{ ml: 2 }}
              >
                {sidebarOpen ? <MenuOpen /> : <Menu />}
              </IconButton>
            </Tooltip>
          </Box>

          {/* PDF Viewer */}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <PdfAnnotator
              pdfUrl={pdfUrl}
              initialHighlights={highlights}
              onHighlightsChange={(newHighlights) => {
                // Détecter si c'est un ajout d'annotation
                const addedHighlight = newHighlights.find(
                  (h) => !highlights.some((old) => old.id === h.id)
                );

                if (addedHighlight) {
                  createAnnotation(addedHighlight);
                }
              }}
              authToken={authToken}
              pdfScaleValue={pdfScaleValue}
              utilsRef={highlighterUtilsRef}
            />
          </Box>
        </Box>

        {/* Sidebar avec commentaires - Desktop: Box fixe, Mobile: Drawer */}
        {isMobile ? (
          <Drawer
            anchor="right"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: '90vw',
                maxWidth: 400,
              },
            }}
          >
            <CommentsSidebar
              highlights={highlights}
              onHighlightClick={handleHighlightClick}
              onDelete={handleDeleteHighlight}
            />
          </Drawer>
        ) : (
          <Box
            sx={{
              width: sidebarOpen ? '350px' : 0,
              minWidth: sidebarOpen ? '300px' : 0,
              maxWidth: sidebarOpen ? '400px' : 0,
              height: '100%',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {sidebarOpen && (
              <CommentsSidebar
                highlights={highlights}
                onHighlightClick={handleHighlightClick}
                onDelete={handleDeleteHighlight}
              />
            )}
          </Box>
        )}
      </Box>

      {/* Dialog de confirmation de suppression */}
      <DeleteConfirmDialog
        open={Boolean(highlightToDelete)}
        onConfirm={confirmDelete}
        onCancel={() => setHighlightToDelete(null)}
      />

      {/* Dialog de grille d'évaluation */}
      <EvaluationGridDialog
        open={evaluationGridOpen}
        onClose={() => setEvaluationGridOpen(false)}
        manuscriptTitle={manuscript?.title || ''}
        evaluatorName={manuscript?.assignedTo?.name || 'Évaluateur'}
        manuscriptId={parseInt(manuscriptId)}
      />
    </Box>
  );
}
