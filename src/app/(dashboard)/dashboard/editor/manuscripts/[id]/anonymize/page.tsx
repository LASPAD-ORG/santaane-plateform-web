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
  Switch,
  FormControlLabel,
  Drawer,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Block,
  Menu,
  MenuOpen,
} from '@mui/icons-material';
import { RedactionsSidebar } from './components/RedactionsSidebar';
import { useRedactions } from './hooks/useRedactions';
import { PdfZoomControls } from '@/app/(dashboard)/dashboard/evaluator/manuscripts/[id]/evaluate/components/PdfZoomControls';

// Dynamic loading to avoid SSR errors with pdfjs
const PdfRedactor = dynamic(() => import('./components/PdfRedactor'), {
  ssr: false,
  loading: () => (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
      <CircularProgress />
    </Box>
  ),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Utility function to get cookies
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export default function AnonymizeManuscriptPage({
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
  const [authToken, setAuthToken] = useState<string>('');
  const [pdfScaleValue, setPdfScaleValue] = useState<number | string>('auto');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewAnonymized, setViewAnonymized] = useState(false);
  const highlighterUtilsRef = React.useRef<any>(null);

  // Hook to manage redactions persistence
  const {
    redactions,
    loading: loadingRedactions,
    saving: savingRedactions,
    anonymizationStatus,
    createRedaction,
    updateRedaction,
    deleteRedaction,
    markAsAnonymized,
    unmarkAsAnonymized,
    refetch,
  } = useRedactions({ manuscriptId: parseInt(manuscriptId) });

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
      const response = await fetch(`/api/manuscripts/detail/${manuscriptId}`);
      if (!response.ok) throw new Error('Erreur lors du chargement');

      const data = await response.json();
      setManuscript(data);
    } catch (err) {
      setError('Impossible de charger le manuscrit');
      console.error(err);
    }
  };

  const handleRedactionClick = (redactionId: string) => {
    try {
      // Find the redaction to validate it has proper position data
      const redaction = redactions.find(r => r.id === redactionId);
      if (!redaction?.position?.boundingRect) {
        console.warn('Cannot scroll to redaction: invalid position data', redactionId);
        return;
      }
      // Check if highlighterUtils is available
      if (!highlighterUtilsRef.current) {
        console.warn('PDF highlighter not ready yet');
        return;
      }

      // Additional safety: check if scrollToHighlight method exists and is callable
      if (typeof highlighterUtilsRef.current.scrollToHighlight !== 'function') {
        console.warn('scrollToHighlight method not available');
        return;
      }

      // Try to scroll, but catch any errors from the highlighter itself
      try {
        highlighterUtilsRef.current.scrollToHighlight(redactionId);
      } catch (scrollError) {
        // If scrollToHighlight fails, silently log and ignore
        // This can happen if the highlight's internal position data is incomplete
        console.debug('Could not scroll to highlight, position data may be incomplete:', scrollError);
      }
    } catch (error) {
      console.error('Error in handleRedactionClick:', error);
    }
  };

  const handleMarkAsAnonymized = async () => {
    if (redactions.length === 0) {
      setError('Veuillez ajouter au moins une zone anonymisée avant de marquer le manuscrit comme anonymisé');
      return;
    }

    try {
      await markAsAnonymized();
      await fetchManuscript(); // Reload to get updated anonymization status
    } catch (err) {
      console.error('Error marking as anonymized:', err);
    }
  };

  const handleUnmarkAsAnonymized = async () => {
    try {
      await unmarkAsAnonymized();
      await fetchManuscript(); // Reload to get updated anonymization status
    } catch (err) {
      console.error('Error unmarking:', err);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
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

  if (!manuscript) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const pdfUrl = `${API_URL}/api/v1/files/view/${manuscript.pdfFilename}`;
  const isAnonymized = manuscript.isAnonymized || anonymizationStatus?.isAnonymized || false;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <IconButton onClick={() => router.back()}>
          <ArrowBack />
        </IconButton>

        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6" noWrap sx={{ flex: 1 }}>
              Anonymisation: {manuscript.title}
            </Typography>
            {isAnonymized && (
              <Chip
                icon={<CheckCircle />}
                label="Anonymisé"
                color="success"
                size="small"
              />
            )}
            {savingRedactions && (
              <Chip
                label="Sauvegarde..."
                color="info"
                size="small"
              />
            )}
          </Stack>
        </Box>

        {/* Mobile sidebar toggle */}
        {isMobile && (
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <MenuOpen /> : <Menu />}
          </IconButton>
        )}
      </Paper>

      {/* Main content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* PDF Viewer */}
        <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {/* Controls bar */}
          <Paper
            elevation={0}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 10,
              p: 1,
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <PdfZoomControls
              currentZoom={pdfScaleValue}
              onZoomChange={setPdfScaleValue}
            />

            <Divider orientation="vertical" flexItem />

            <FormControlLabel
              control={
                <Switch
                  checked={viewAnonymized}
                  onChange={(e) => setViewAnonymized(e.target.checked)}
                  color="error"
                />
              }
              label={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {viewAnonymized ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  <Typography variant="body2">
                    {viewAnonymized ? 'Vue anonymisée' : 'Vue normale'}
                  </Typography>
                </Stack>
              }
            />

            <Divider orientation="vertical" flexItem />

            {!isAnonymized ? (
              <Button
                variant="contained"
                color="error"
                startIcon={<Block />}
                onClick={handleMarkAsAnonymized}
                disabled={redactions.length === 0 || savingRedactions}
                size="small"
              >
                Marquer comme anonymisé
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="warning"
                onClick={handleUnmarkAsAnonymized}
                disabled={savingRedactions}
                size="small"
              >
                Démarquer
              </Button>
            )}
          </Paper>

          {/* PDF Redactor */}
          <PdfRedactor
            pdfUrl={pdfUrl}
            initialRedactions={redactions}
            onRedactionsChange={(newRedactions) => {
              // Handle local state update
              const lastRedaction = newRedactions[0];
              if (lastRedaction && !redactions.find(r => r.id === lastRedaction.id)) {
                // New redaction created
                createRedaction(lastRedaction);
              }
            }}
            authToken={authToken}
            pdfScaleValue={pdfScaleValue}
            utilsRef={highlighterUtilsRef}
            viewAnonymized={viewAnonymized}
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
            <RedactionsSidebar
              redactions={redactions}
              onRedactionClick={handleRedactionClick}
              onDelete={deleteRedaction}
            />
          </Drawer>
        ) : (
          <Box sx={{ width: 350, flexShrink: 0 }}>
            <RedactionsSidebar
              redactions={redactions}
              onRedactionClick={handleRedactionClick}
              onDelete={deleteRedaction}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
