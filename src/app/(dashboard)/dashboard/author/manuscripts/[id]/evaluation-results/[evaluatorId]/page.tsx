'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { PdfScaleValue } from 'react-pdf-highlighter-plus';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Stack,
  IconButton,
  CircularProgress,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack,
  Assignment,
  Menu,
  MenuOpen,
} from '@mui/icons-material';
import { useEvaluatorAnnotations } from '@/app/(dashboard)/dashboard/editor/manuscripts/[id]/evaluation-result/[evaluatorId]/hooks/useEvaluatorAnnotations';
import { useEvaluatorGrid } from '@/app/(dashboard)/dashboard/editor/manuscripts/[id]/evaluation-result/[evaluatorId]/hooks/useEvaluatorGrid';
import { CommentsSidebar } from '@/app/(dashboard)/dashboard/evaluator/manuscripts/[id]/evaluate/components/CommentsSidebar';
import { PdfZoomControls } from '@/app/(dashboard)/dashboard/evaluator/manuscripts/[id]/evaluate/components/PdfZoomControls';
import { EvaluationGridDisplay } from '@/app/(dashboard)/dashboard/editor/manuscripts/[id]/evaluation-result/[evaluatorId]/components/EvaluationGridDisplay';
import { getAnonymizedEvaluatorName } from '@/utils/anonymizeEvaluator';
import type { Manuscript } from '@/types/manuscript';

const PdfAnnotator = dynamic(
  () => import('@/app/(dashboard)/dashboard/evaluator/manuscripts/[id]/evaluate/components/PdfAnnotator'),
  {
    ssr: false,
    loading: () => (
      <Box display="flex" alignItems="center" justifyContent="center" height="100%">
        <CircularProgress />
      </Box>
    ),
  }
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export default function AuthorEvaluationResultPage({
  params,
}: {
  params: Promise<{ id: string; evaluatorId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const manuscriptId = parseInt(resolvedParams.id);
  const evaluatorId = parseInt(resolvedParams.evaluatorId);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [authToken, setAuthToken] = useState<string>('');
  const [pdfScaleValue, setPdfScaleValue] = useState<PdfScaleValue>('auto');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [gridDialogOpen, setGridDialogOpen] = useState(false);
  const highlighterUtilsRef = React.useRef<any>(null);

  // Fetch data using hooks
  const {
    annotations: rawAnnotations,
    loading: loadingAnnotations,
    error: annotationsError,
  } = useEvaluatorAnnotations({ manuscriptId, evaluatorId });

  const {
    grid,
    loading: loadingGrid,
    error: gridError,
  } = useEvaluatorGrid({ manuscriptId, evaluatorId });

  // Filter annotations to only include those with valid position data
  const annotations = React.useMemo(() => {
    return rawAnnotations.filter(annotation => {
      const hasValidPosition = annotation.position &&
                               annotation.position.boundingRect &&
                               typeof annotation.position.boundingRect.pageNumber === 'number';
      if (!hasValidPosition) {
        console.warn('Skipping annotation with invalid position:', annotation.id);
      }
      return hasValidPosition;
    });
  }, [rawAnnotations]);

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
      const response = await fetch(`/api/manuscripts/${manuscriptId}`);
      if (!response.ok) throw new Error('Erreur lors du chargement');
      const data = await response.json();
      setManuscript(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnnotationClick = (annotationId: string) => {
    const annotation = annotations.find(a => a.id === annotationId);
    if (annotation && highlighterUtilsRef.current) {
      // All annotations are pre-filtered to have valid positions
      if (isMobile) {
        setSidebarOpen(false);
      }
      highlighterUtilsRef.current.scrollToHighlight(annotation);
    }
  };

  // Calculate anonymized evaluator name
  const anonymizedEvaluatorName = manuscript
    ? getAnonymizedEvaluatorName(manuscript.evaluators || [], evaluatorId)
    : 'Chargement...';

  const error = annotationsError || gridError;
  const isPendingValidation = !!error && error.includes('cours de validation');

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity={isPendingValidation ? 'info' : 'error'}>
          {isPendingValidation
            ? "Les evaluations de votre manuscrit sont en cours de validation par l'editeur. Vous serez notifie(e) par email des qu'elles seront disponibles."
            : error}
        </Alert>
        <Button
          onClick={() => router.back()}
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Retour
        </Button>
      </Box>
    );
  }

  if (!manuscript || loadingAnnotations || loadingGrid) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress />
        <Typography ml={2}>Chargement de l'évaluation...</Typography>
      </Box>
    );
  }

  const pdfUrl = `${API_URL}/api/v1/files/view/${manuscript.pdfFilename}`;

  // Create a modified grid with anonymized evaluator name for display
  const gridWithAnonymizedName = grid ? {
    ...grid,
    evaluatorName: anonymizedEvaluatorName,
  } : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
          <Stack direction="row" alignItems="center" gap={2}>
            <IconButton onClick={() => router.back()}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h6">Évaluation de votre manuscrit</Typography>
              <Typography variant="body2" color="text.secondary">
                {manuscript.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Évaluateur SLSP{evaluatorId}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" gap={2}>
            {/* Contrôles de zoom */}
            <PdfZoomControls
              currentZoom={pdfScaleValue}
              onZoomChange={setPdfScaleValue}
            />
            
            <Button
              variant="contained"
              startIcon={<Assignment />}
              onClick={() => setGridDialogOpen(true)}
              disabled={!grid}
            >
              Voir la grille d'évaluation
            </Button>

            {isMobile && (
              <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <MenuOpen /> : <Menu />}
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Main content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* PDF Viewer */}
        <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {/* PDF Viewer */}
          <PdfAnnotator
            pdfUrl={pdfUrl}
            initialHighlights={annotations}
            authToken={authToken}
            pdfScaleValue={pdfScaleValue}
            utilsRef={highlighterUtilsRef}
            readOnly={true}
          />
        </Box>

        {/* Sidebar */}
        {isMobile ? (
          <Drawer
            anchor="right"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: 350,
              },
            }}
          >
            <CommentsSidebar
              highlights={annotations}
              onHighlightClick={handleAnnotationClick}
              readOnly={true}
            />
          </Drawer>
        ) : (
          <Box sx={{ width: 350, flexShrink: 0 }}>
            <CommentsSidebar
              highlights={annotations}
              onHighlightClick={handleAnnotationClick}
              readOnly={true}
            />
          </Box>
        )}
      </Box>

      {/* Evaluation Grid Display */}
      {gridWithAnonymizedName && (
        <EvaluationGridDisplay
          open={gridDialogOpen}
          onClose={() => setGridDialogOpen(false)}
          grid={gridWithAnonymizedName}
        />
      )}
    </Box>
  );
}
