'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { PdfScaleValue } from 'react-pdf-highlighter-plus';
import { apiClient } from '@/lib/api/client';

import {
  Box,
  Paper,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Chip,
  Stack,
  IconButton,
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
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CropSquareIcon from '@mui/icons-material/CropSquare';
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
  const [pdfScaleValue, setPdfScaleValue] = useState<PdfScaleValue>('auto');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewAnonymized, setViewAnonymized] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'text' | 'area'>('area');
  const highlighterUtilsRef = React.useRef<any>(null);

  const {
    redactions,
    saving: savingRedactions,
    anonymizationStatus,
    createRedaction,
    deleteRedaction,
    markAsAnonymized,
    unmarkAsAnonymized,
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
      // ✅ FIX: apiClient a withCredentials:true — envoie le cookie auth_token
      const response = await apiClient.get(`/manuscripts/detail/${manuscriptId}`);
      setManuscript(response.data);
    } catch (err) {
      setError('Impossible de charger le manuscrit');
      console.error(err);
    }
  };

  const handleRedactionClick = (redactionId: string) => {
    try {
      const redaction = redactions.find(r => r.id === redactionId);
      if (!redaction?.position?.boundingRect) {
        console.warn('Cannot scroll to redaction: invalid position data', redactionId);
        return;
      }
      if (!highlighterUtilsRef.current) {
        console.warn('PDF highlighter not ready yet');
        return;
      }
      if (typeof highlighterUtilsRef.current.scrollToHighlight !== 'function') {
        console.warn('scrollToHighlight method not available');
        return;
      }
      try {
        highlighterUtilsRef.current.scrollToHighlight(redactionId);
      } catch (scrollError) {
        console.debug('Could not scroll to highlight:', scrollError);
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
      await fetchManuscript();
    } catch (err) {
      console.error('Error marking as anonymized:', err);
    }
  };

  const handleUnmarkAsAnonymized = async () => {
    try {
      await unmarkAsAnonymized();
      await fetchManuscript();
    } catch (err) {
      console.error('Error unmarking:', err);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => router.back()} startIcon={<ArrowBack />} sx={{ mt: 2 }}>
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

  // ✅ URL via route Next.js avec auth cookie
  const pdfUrl = `/api/files/download/${manuscript.pdfFilename}`;
  const isAnonymized = manuscript.isAnonymized || anonymizationStatus?.isAnonymized || false;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <IconButton onClick={() => router.back()}>
          <ArrowBack />
        </IconButton>

        <Typography variant="h6" noWrap>
          Anonymisation: {manuscript.title}
        </Typography>

        {isAnonymized && (
          <Chip icon={<CheckCircle />} label="Anonymisé" color="success" size="small" />
        )}

        {savingRedactions && (
          <Chip label="Sauvegarde..." color="info" size="small" />
        )}

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" alignItems="center" spacing={1}>
          <PdfZoomControls currentZoom={pdfScaleValue} onZoomChange={setPdfScaleValue} />

          <Divider orientation="vertical" flexItem />

          <ToggleButtonGroup
            value={selectionMode}
            exclusive
            size="small"
            onChange={(_, val) => { if (val) setSelectionMode(val); }}
          >
            <ToggleButton value="area">
              <CropSquareIcon fontSize="small" sx={{ mr: 0.5 }} /> Zone
            </ToggleButton>
            <ToggleButton value="text">
              <TextFieldsIcon fontSize="small" sx={{ mr: 0.5 }} /> Texte
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem />

          <FormControlLabel
            control={
              <Switch
                checked={viewAnonymized}
                onChange={(e) => setViewAnonymized(e.target.checked)}
                color="error"
                size="small"
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
            sx={{ mr: 0 }}
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
        </Stack>

        {isMobile && (
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <MenuOpen /> : <Menu />}
          </IconButton>
        )}
      </Paper>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <PdfRedactor
            pdfUrl={pdfUrl}
            initialRedactions={redactions}
            onRedactionsChange={(newRedactions) => {
              const lastRedaction = newRedactions[0];
              if (lastRedaction && !redactions.find(r => r.id === lastRedaction.id)) {
                createRedaction(lastRedaction);
              }
            }}
            authToken={authToken}
            pdfScaleValue={pdfScaleValue}
            utilsRef={highlighterUtilsRef}
            viewAnonymized={viewAnonymized}
            selectionMode={selectionMode}
          />
        </Box>

        {isMobile ? (
          <Drawer
            anchor="right"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            sx={{ '& .MuiDrawer-paper': { width: 350 } }}
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
