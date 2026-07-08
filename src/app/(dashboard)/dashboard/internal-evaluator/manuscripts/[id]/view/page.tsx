'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { exportPdf, type PdfScaleValue } from 'react-pdf-highlighter-plus';
import {
  Box,
  Paper,
  Typography,
  Alert,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  InfoOutlined,
} from '@mui/icons-material';
import { PdfZoomControls } from '../evaluate/components/PdfZoomControls';
import { ManuscriptDetailsDialog } from '../evaluate/components/ManuscriptDetailsDialog';
import { useRedactionMasks } from '../evaluate/hooks/useRedactionMasks';

// Chargement dynamique pour éviter les erreurs SSR avec pdfjs
const PdfAnnotator = dynamic(() => import('../evaluate/components'), {
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

export default function ViewManuscriptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const manuscriptId = resolvedParams.id;
  const theme = useTheme();

  const [manuscript, setManuscript] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string>('');
  const [pdfScaleValue, setPdfScaleValue] = useState<PdfScaleValue>('auto');
  const [manuscriptDetailsOpen, setManuscriptDetailsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });

  // Hook pour récupérer les masques de redaction (zones anonymisées)
  const {
    masks: redactionMasks,
    loading: loadingRedactionMasks,
  } = useRedactionMasks({ manuscriptId: parseInt(manuscriptId) });

  // Chargement initial simple
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Vérifier l'authentification via l'API
        const authResponse = await fetch('/api/auth/me');
        if (!authResponse.ok) {
          setError('Non authentifié. Veuillez vous reconnecter.');
          setIsLoaded(true);
          return;
        }
        
        // Le token est géré automatiquement par les cookies HTTP-only
        setAuthToken('authenticated');

        // 2. Récupérer le manuscrit
        const response = await fetch('/api/evaluator/manuscripts', { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des manuscrits');
        }

        const data = await response.json();
        const found = data.find((m: any) => m.id === parseInt(manuscriptId));

        if (!found) {
          setError(`Manuscrit ${manuscriptId} non trouvé dans votre liste d'assignations`);
        } else {
          setManuscript(found);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger le manuscrit');
      }

      setIsLoaded(true);
    };

    loadData();
  }, []); // Exécuté une seule fois au montage

  const handleDownload = async () => {
    if (!manuscript?.pdfFilename) return;

    setIsExporting(true);
    setExportProgress({ current: 0, total: 0 });

    try {
      // Créer les masques de rédaction pour l'export
      const allHighlights = redactionMasks.map(mask => {
        try {
          const position = JSON.parse(mask.positionData);
          return {
            id: mask.id,
            type: 'area' as const,
            position: position,
            highlightColor: '#000000', // Couleur noire opaque pour les masques
            content: { text: '' },
          };
        } catch (error) {
          console.error('Failed to parse redaction mask position:', error);
          return null;
        }
      }).filter((h): h is NonNullable<typeof h> => h !== null); // Supprimer les masques invalides

      // Utiliser notre route API Next.js qui gère l'authentification automatiquement
      const exportPdfUrl = `/api/manuscripts/${manuscriptId}/download`;

      // Exporter le PDF avec les masques d'anonymisation
      const pdfBytes = await exportPdf(
        exportPdfUrl, // URL simple - les cookies sont gérés automatiquement
        allHighlights,
        {
          onProgress: (current, total) => {
            setExportProgress({ current, total });
          },
        }
      );

      // Télécharger le fichier PDF anonymisé
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${manuscript.title || 'manuscript'}_anonymise.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erreur lors du téléchargement du PDF anonymisé');
      console.error(err);
    } finally {
      setIsExporting(false);
      setExportProgress({ current: 0, total: 0 });
    }
  };

  // URL du PDF via notre API route qui gère l'authentification
  const pdfUrl = manuscript 
    ? `/api/manuscripts/${manuscriptId}/download`
    : '';

  // Afficher le loader si pas encore chargé
  if (!isLoaded) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
          Chargement du manuscrit...
        </Typography>
      </Box>
    );
  }

  // Afficher l'erreur si erreur ET pas de manuscrit
  if (error && !manuscript) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Alert severity="error" sx={{ maxWidth: 600, textAlign: 'center' }}>
          {error}
        </Alert>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => router.push('/dashboard/internal-evaluator/manuscripts')}
        >
          Retour à la liste des manuscrits
        </Button>
      </Box>
    );
  }

  // Le manuscrit doit être disponible ici
  if (!manuscript) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Alert severity="error" sx={{ maxWidth: 600, textAlign: 'center' }}>
          Manuscrit non trouvé
        </Alert>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => router.push('/dashboard/internal-evaluator/manuscripts')}
        >
          Retour à la liste des manuscrits
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header avec titre et actions */}
      <Paper
        elevation={1}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }}>
            <IconButton onClick={() => router.push('/dashboard/internal-evaluator/manuscripts')}>
              <ArrowBack />
            </IconButton>
            <Box flex={1}>
              <Typography variant="h6" gutterBottom>
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
            <Tooltip title={isExporting ? "Export en cours..." : "Télécharger la version anonymisée"}>
              <IconButton 
                onClick={handleDownload} 
                color="primary"
                disabled={isExporting}
              >
                {isExporting ? <CircularProgress size={24} /> : <Download />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Détails du manuscrit">
              <IconButton 
                onClick={() => setManuscriptDetailsOpen(true)} 
                color="primary"
              >
                <InfoOutlined />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Barre de progression pour l'export */}
          {isExporting && exportProgress.total > 0 && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={(exportProgress.current / exportProgress.total) * 100} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Export en cours... ({exportProgress.current}/{exportProgress.total})
              </Typography>
            </Box>
          )}
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* Contenu principal - PDF Viewer */}
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
          {/* Contrôles de zoom */}
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
          </Box>

          {/* PDF Viewer */}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <PdfAnnotator
              pdfUrl={pdfUrl}
              initialHighlights={[]} // Pas d'annotations en mode consultation
              onHighlightsChange={() => {}} // Pas de changement d'annotations
              authToken={authToken}
              pdfScaleValue={pdfScaleValue}
              redactionMasks={redactionMasks} // Afficher les masques d'anonymisation
              annotationEnabled={false} // Désactiver complètement l'annotation
            />
          </Box>
        </Box>
      </Box>

      {/* Dialog des détails du manuscrit */}
      <ManuscriptDetailsDialog
        open={manuscriptDetailsOpen}
        onClose={() => setManuscriptDetailsOpen(false)}
        manuscript={manuscript}
      />
    </Box>
  );
}