'use client';

import React, { useState, useCallback, useRef, MouseEvent } from 'react';
import {
  PdfLoader,
  PdfHighlighter,
  TextHighlight,
  AreaHighlight,
  FreetextHighlight,
  useHighlightContainerContext,
  usePdfHighlighterContext,
  MonitoredHighlightContainer,
  type PdfSelection,
  type PdfHighlighterUtils,
  type GhostHighlight,
  type ScaledPosition,
  type ViewportHighlight,
} from 'react-pdf-highlighter-plus';
import 'pdfjs-dist/web/pdf_viewer.css';
import 'react-pdf-highlighter-plus/style/style.css';
import {
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  ThumbUp,
  ThumbDown,
  HelpOutline,
  Lightbulb,
} from '@mui/icons-material';
import type { EvaluatorHighlight } from '@/types/evaluator';

interface PdfAnnotatorProps {
  pdfUrl: string;
  initialHighlights?: EvaluatorHighlight[];
  onHighlightsChange?: (highlights: EvaluatorHighlight[]) => void;
  authToken?: string;
}

const categoryColors = {
  positive: '#4caf50',
  negative: '#f44336',
  question: '#2196f3',
  suggestion: '#ff9800',
};

const categoryIcons = {
  positive: <ThumbUp fontSize="small" />,
  negative: <ThumbDown fontSize="small" />,
  question: <HelpOutline fontSize="small" />,
  suggestion: <Lightbulb fontSize="small" />,
};

const getNextId = () => String(Math.random()).slice(2);

// Composant pour rendre un highlight
function HighlightContainer({
  editHighlight,
  onContextMenu,
}: {
  editHighlight: (id: string, edit: Partial<EvaluatorHighlight>) => void;
  onContextMenu?: (event: MouseEvent<HTMLDivElement>, highlight: ViewportHighlight<EvaluatorHighlight>) => void;
}) {
  const { highlight, isScrolledTo, viewportToScaled, screenshot, highlightBindings } =
    useHighlightContainerContext<EvaluatorHighlight>();
  const { toggleEditInProgress } = usePdfHighlighterContext();

  // DEBUG: Vérifier le type du highlight
  console.log('🎨 Rendu highlight:', { id: highlight.id, type: highlight.type, category: highlight.category });

  const getHighlightColor = () => {
    if (highlight.category) {
      return categoryColors[highlight.category];
    }
    return 'rgba(255, 226, 143, 0.5)';
  };

  if (highlight.type === 'text') {
    return (
      <MonitoredHighlightContainer>
        <TextHighlight
          highlight={highlight}
          isScrolledTo={isScrolledTo}
          style={{ background: getHighlightColor() }}
          onContextMenu={onContextMenu ? (e) => onContextMenu(e, highlight) : undefined}
        />
      </MonitoredHighlightContainer>
    );
  } else if (highlight.type === 'area') {
    return (
      <MonitoredHighlightContainer>
        <AreaHighlight
          highlight={highlight}
          isScrolledTo={isScrolledTo}
          style={{ background: getHighlightColor(), border: `2px solid ${getHighlightColor()}` }}
          onChange={(boundingRect) => {
            editHighlight(highlight.id, {
              position: {
                boundingRect: viewportToScaled(boundingRect),
                rects: [],
              },
              content: { image: screenshot(boundingRect) },
            });
            toggleEditInProgress(false);
          }}
          bounds={highlightBindings.textLayer}
          onEditStart={() => toggleEditInProgress(true)}
          onContextMenu={onContextMenu ? (e) => onContextMenu(e, highlight) : undefined}
        />
      </MonitoredHighlightContainer>
    );
  } else if (highlight.type === 'freetext') {
    return (
      <MonitoredHighlightContainer>
        <FreetextHighlight
          highlight={highlight}
          isScrolledTo={isScrolledTo}
          onChange={(boundingRect) => {
            editHighlight(highlight.id, {
              position: {
                boundingRect: viewportToScaled(boundingRect),
                rects: [],
              },
            });
            toggleEditInProgress(false);
          }}
          onTextChange={(newText) => {
            editHighlight(highlight.id, {
              content: { text: newText },
            });
          }}
          onEditStart={() => toggleEditInProgress(true)}
          onEditEnd={() => toggleEditInProgress(false)}
          color="#333333"
          backgroundColor={getHighlightColor()}
          onContextMenu={onContextMenu ? (e) => onContextMenu(e, highlight) : undefined}
        />
      </MonitoredHighlightContainer>
    );
  } else {
    console.warn('⚠️ Type de highlight inconnu:', highlight.type, highlight);
    return null;
  }
}

interface CommentFormProps {
  onSubmit: (comment: string, category: EvaluatorHighlight['category']) => void;
  onCancel: () => void;
}

function CommentForm({ onSubmit, onCancel }: CommentFormProps) {
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<EvaluatorHighlight['category']>('positive');

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment, category);
      setComment('');
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        p: 3,
        zIndex: 2000,
        maxWidth: '90vw',
      }}
    >
      <Stack spacing={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Ajouter un commentaire</Typography>
          <IconButton size="small" onClick={onCancel}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Votre commentaire..."
          autoFocus
        />

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Catégorie :
          </Typography>
          <Stack direction="row" spacing={1} mt={1}>
            {(['positive', 'negative', 'question', 'suggestion'] as const).map((cat) => (
              <Chip
                key={cat}
                icon={categoryIcons[cat]}
                label={cat}
                onClick={() => setCategory(cat)}
                color={category === cat ? 'primary' : 'default'}
                variant={category === cat ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button onClick={onCancel} variant="outlined" size="small">
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="small"
            disabled={!comment.trim()}
          >
            Valider
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function PdfAnnotator({
  pdfUrl,
  initialHighlights = [],
  onHighlightsChange,
  authToken,
}: PdfAnnotatorProps) {
  const [highlights, setHighlights] = useState<EvaluatorHighlight[]>(initialHighlights);
  const [pendingHighlight, setPendingHighlight] = useState<GhostHighlight | null>(null);
  const highlighterUtilsRef = useRef<PdfHighlighterUtils | null>(null);

  const updateHighlights = useCallback(
    (newHighlights: EvaluatorHighlight[]) => {
      setHighlights(newHighlights);
      onHighlightsChange?.(newHighlights);
    },
    [onHighlightsChange]
  );

  const editHighlight = useCallback(
    (id: string, edit: Partial<EvaluatorHighlight>) => {
      const updated = highlights.map((h) => (h.id === id ? { ...h, ...edit } : h));
      updateHighlights(updated);
    },
    [highlights, updateHighlights]
  );

  const addHighlight = useCallback(
    (highlight: GhostHighlight, comment: string, category: EvaluatorHighlight['category']) => {
      console.log('Ajout highlight:', highlight);

      // Vérifier que le type existe
      if (!highlight.type) {
        console.error('❌ Le highlight n\'a pas de type!', highlight);
        return;
      }

      const newHighlight: EvaluatorHighlight = {
        ...highlight,
        id: getNextId(),
        comment,
        category,
      };

      console.log('✅ Nouveau highlight créé:', newHighlight);
      updateHighlights([newHighlight, ...highlights]);
      setPendingHighlight(null);
    },
    [highlights, updateHighlights]
  );

  const handleSelection = useCallback(
    (selection: PdfSelection) => {
      console.log('Sélection détectée:', selection);
      const ghostHighlight = selection.makeGhostHighlight();
      setPendingHighlight(ghostHighlight);
    },
    []
  );

  const handleCommentSubmit = useCallback(
    (comment: string, category: EvaluatorHighlight['category']) => {
      if (pendingHighlight) {
        addHighlight(pendingHighlight, comment, category);
      }
    },
    [pendingHighlight, addHighlight]
  );

  const pdfDocument = authToken
    ? {
        url: pdfUrl,
        httpHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    : pdfUrl;

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <PdfLoader document={pdfDocument}>
        {(pdfDoc) => (
          <PdfHighlighter
            pdfDocument={pdfDoc}
            highlights={highlights}
            onSelection={handleSelection}
            enableAreaSelection={(e) => e.altKey}
            utilsRef={(utils) => {
              highlighterUtilsRef.current = utils;
            }}
            style={{
              height: '100%',
              width: '100%',
            }}
          >
            <HighlightContainer editHighlight={editHighlight} />
          </PdfHighlighter>
        )}
      </PdfLoader>

      {pendingHighlight && (
        <CommentForm
          onSubmit={handleCommentSubmit}
          onCancel={() => setPendingHighlight(null)}
        />
      )}
    </Box>
  );
}
