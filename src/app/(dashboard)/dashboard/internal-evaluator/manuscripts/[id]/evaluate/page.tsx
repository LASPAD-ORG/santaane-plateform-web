'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { exportPdf, type PdfScaleValue } from 'react-pdf-highlighter-plus';
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
  InfoOutlined,
} from '@mui/icons-material';
import type { EvaluatorHighlight } from '@/types/evaluator';
import { CommentsSidebar } from './components/CommentsSidebar';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';
import { PdfZoomControls } from './components/PdfZoomControls';
import { EvaluationGridDialog } from './components/EvaluationGridDialog';
import { ManuscriptDetailsDialog } from './components/ManuscriptDetailsDialog';
import { useAuthStore } from '@/stores/authStore';
import { useAnnotations } from './hooks/useAnnotations';
import { useRedactionMasks } from './hooks/useRedactionMasks';
import ValidateForExternalButton from './components/ValidateForExternalButton';
import ProposeExternalDialog from './components/ProposeExternalDialog';

const PdfAnnotator = dynamic(() => import('./components'), {
  ssr: false,
  loading: () => (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
      <CircularProgress />
    </Box>
  ),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
  const { user } = useAuthStore();
  const resolvedParams = use(params);
  const manuscriptId = resolvedParams.id;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [manuscript, setManuscript] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authToken, setAuthToken] = useState<string>('');
  const [highlightToDelete, setHighlightToDelete] = useState<string | null>(null);
  const [pdfScaleValue, setPdfScaleValue] = useState<PdfScaleValue>('auto');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [evaluationGridOpen, setEvaluationGridOpen] = useState(false);
  const [manuscriptDetailsOpen, setManuscriptDetailsOpen] = useState(false);
  const [gridSubmitted, setGridSubmitted] = useState(false);
  const [proposeOpen, setProposeOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });
  const highlighterUtilsRef = React.useRef<any>(null);

  // ✅ FIX : parseInt(manuscriptId) directement, sans condition manuscript
  const {
    highlights: rawHighlights,
    loading: loadingAnnotations,
    saving: savingAnnotations,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
  } = useAnnotations({ manuscriptId: parseInt(manuscriptId), evaluatorId: user ? parseInt(user.id) : undefined });


  const highlights = React.useMemo(() => {
    return rawHighlights.filter(highlight => {
      const hasValidPosition = highlight.position &&
                               highlight.position.boundingRect &&
                               typeof highlight.position.boundingRect.pageNumber === 'number';
      if (!hasValidPosition) {
        console.warn('Skipping highlight with invalid position:', highlight.id);
      }
      return hasValidPosition;
    });
  }, [rawHighlights]);

  const redactionEnabled = !!manuscript;
  console.log('Redaction masks enabled:', {
    manuscript: !!manuscript,
    enabled: redactionEnabled,
    manuscriptId: parseInt(manuscriptId)
  });

  const {
    masks: redactionMasks,
    loading: loadingRedactionMasks,
  } = useRedactionMasks({
    manuscriptId: parseInt(manuscriptId),
    enabled: redactionEnabled
  });

  console.log('Redaction masks loaded:', {
    count: redactionMasks.length,
    loading: loadingRedactionMasks,
    masks: redactionMasks
  });

  useEffect(() => {
    const token = getCookie('auth_token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    fetchManuscript();
  }, [manuscriptId]);

  // Lit discrètement si la grille de l'interne a été soumise (pour activer le bouton Valider)
  useEffect(() => {
    if (manuscript?.assignmentStatus !== 'accepted') return;
    (async () => {
      try {
        const res = await fetch(`/api/manuscripts/${manuscriptId}/evaluation-grid`);
        if (!res.ok) return;
        const g = await res.json();
        setGridSubmitted(Boolean(g?.submittedAt));
      } catch {
        /* silencieux */
      }
    })();
  }, [manuscript, manuscriptId, evaluationGridOpen]);

  const fetchManuscript = async () => {
    try {
      const response = await fetch('/api/evaluator/manuscripts', { credentials: 'include' });
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

  const handleDownload = async () => {
    if (!manuscript?.pdfFilename) return;

    setIsExporting(true);
    setExportProgress({ current: 0, total: 0 });

    try {
      const allHighlights = [
        ...highlights.map(h => ({
          id: h.id,
          type: h.type,
          content: h.content,
          position: h.position,
          highlightColor: 'rgba(255, 235, 59, 0.4)',
        })),
        ...redactionMasks.map(mask => {
          try {
            const position = JSON.parse(mask.positionData);
            return {
              id: mask.id,
              type: 'area' as const,
              position: position,
              highlightColor: '#000000',
              content: { text: '' },
            };
          } catch (error) {
            console.error('Failed to parse redaction mask position:', error);
            return null;
          }
        }).filter((h): h is NonNullable<typeof h> => h !== null),
      ];

      const exportPdfUrl = `/api/manuscripts/${manuscriptId}/download`;

      const pdfBytes = await exportPdf(
        exportPdfUrl,
        allHighlights,
        {
          textHighlightColor: 'rgba(255, 235, 59, 0.4)',
          areaHighlightColor: 'rgba(255, 235, 59, 0.4)',
          onProgress: (current, total) => {
            setExportProgress({ current, total });
          },
        }
      );

      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${manuscript.title || 'manuscript'}_annotated.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export failed:', error);
      setError('Échec de l\'export du PDF annoté');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSubmitEvaluation = async () => {
    if (highlights.length === 0) {
      setError('Veuillez ajouter au moins un commentaire');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Soumission de l\'évaluation:', {
        manuscriptId,
        highlights: highlights.map(h => ({
          type: h.type,
          comment: h.comment,
          position: h.position,
        })),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Évaluation soumise avec succès !');
      router.push('/dashboard/internal-evaluator/manuscripts');
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
          onClick={() => router.push('/dashboard/internal-evaluator/manuscripts')}
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

  const pdfUrl = `/api/manuscripts/${manuscriptId}/download`;

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
            <IconButton onClick={() => router.push('/dashboard/internal-evaluator/manuscripts')}>
              <ArrowBack />
            </IconButton>
            <Box flex={1}>
              <Typography
                variant="h6"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                gutterBottom
              >
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
            <Tooltip title={isExporting ? "Export en cours..." : "Télécharger le PDF annoté"}>
              <IconButton
                onClick={handleDownload}
                color="primary"
                disabled={isExporting}
              >
                {isExporting ? <CircularProgress size={20} /> : <Download />}
              </IconButton>
            </Tooltip>
            {isExporting && exportProgress.total > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                {exportProgress.current}/{exportProgress.total}
              </Typography>
            )}
            <Tooltip title="Détails du manuscrit">
              <IconButton
                onClick={() => setManuscriptDetailsOpen(true)}
                color="primary"
              >
                <InfoOutlined />
              </IconButton>
            </Tooltip>
            {manuscript?.assignmentStatus === 'accepted' && (
              <Button
                variant="contained"
                startIcon={<Assignment />}
                onClick={() => setEvaluationGridOpen(true)}
              >
                Grille d&apos;évaluation
              </Button>
            )}
            {manuscript?.assignmentStatus === 'accepted' && (
              <ValidateForExternalButton
                manuscriptId={parseInt(manuscriptId)}
                gridSubmitted={gridSubmitted}
                onValidated={() => router.push('/dashboard/internal-evaluator/manuscripts')}
              />
            )}
            {manuscript?.assignmentStatus === 'accepted' && (
              <Button
                variant="outlined"
                startIcon={<Assignment />}
                onClick={() => setProposeOpen(true)}
              >
                Proposer des externes
              </Button>
            )}
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {manuscript?.assignmentStatus !== 'accepted' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Vous devez accepter la demande d'évaluation pour pouvoir annoter ce manuscrit et accéder à la grille d'évaluation.
          </Alert>
        )}
      </Paper>

      {/* Contenu principal */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Box
          sx={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease-in-out',
          }}
        >
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

          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <PdfAnnotator
              pdfUrl={pdfUrl}
              initialHighlights={highlights}
              onHighlightsChange={(newHighlights) => {
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
              redactionMasks={redactionMasks}
              annotationEnabled={manuscript?.assignmentStatus === 'accepted'}
            />
          </Box>
        </Box>

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

      <DeleteConfirmDialog
        open={Boolean(highlightToDelete)}
        onConfirm={confirmDelete}
        onCancel={() => setHighlightToDelete(null)}
      />

      <EvaluationGridDialog
        open={evaluationGridOpen}
        onClose={() => setEvaluationGridOpen(false)}
        manuscriptTitle={manuscript?.title || ''}
        evaluatorName={manuscript?.assignedTo?.name || 'Évaluateur'}
        manuscriptId={parseInt(manuscriptId)}
      />

      <ManuscriptDetailsDialog
        open={manuscriptDetailsOpen}
        onClose={() => setManuscriptDetailsOpen(false)}
        manuscript={manuscript}
      />
      <ProposeExternalDialog
        open={proposeOpen}
        onClose={() => setProposeOpen(false)}
        manuscriptId={parseInt(manuscriptId)}
      />
    </Box>
  );
}