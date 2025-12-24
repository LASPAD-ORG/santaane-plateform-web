'use client';

import React, { useState, useCallback, useRef, MouseEvent, useEffect } from 'react';
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
import { Box } from '@mui/material';
import type { EvaluatorHighlight } from '@/types/evaluator';
import { SelectionTip } from './SelectionTip';
import { HighlightTooltip } from './HighlightTooltip';

interface PdfAnnotatorProps {
  pdfUrl: string;
  initialHighlights?: EvaluatorHighlight[];
  onHighlightsChange?: (highlights: EvaluatorHighlight[]) => void;
  authToken?: string;
  pdfScaleValue?: number | string;
  utilsRef?: React.MutableRefObject<PdfHighlighterUtils | null>;
}

// Couleur unique pour tous les highlights (jaune)
const HIGHLIGHT_COLOR = 'rgba(255, 235, 59, 0.4)';

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

  // Créer le tooltip avec le commentaire
  const highlightTip = {
    position: highlight.position,
    content: <HighlightTooltip comment={highlight.comment} />,
  };

  if (highlight.type === 'text') {
    return (
      <MonitoredHighlightContainer highlightTip={highlightTip}>
        <TextHighlight
          highlight={highlight}
          isScrolledTo={isScrolledTo}
          style={{
            backgroundColor: HIGHLIGHT_COLOR,
            transition: 'all 0.3s ease-in-out',
            ...(isScrolledTo && {
              backgroundColor: 'rgba(255, 235, 59, 0.8)',
              outline: '2px solid #fbc02d',
              animation: 'pulse 1s ease-in-out',
            }),
          }}
          onContextMenu={onContextMenu ? (e) => onContextMenu(e, highlight) : undefined}
        />
      </MonitoredHighlightContainer>
    );
  } else if (highlight.type === 'area') {
    return (
      <MonitoredHighlightContainer highlightTip={highlightTip}>
        <AreaHighlight
          highlight={highlight}
          isScrolledTo={isScrolledTo}
          style={{
            backgroundColor: HIGHLIGHT_COLOR,
            border: `2px solid #fbc02d`,
            transition: 'all 0.3s ease-in-out',
            ...(isScrolledTo && {
              backgroundColor: 'rgba(255, 235, 59, 0.8)',
              border: '3px solid #fbc02d',
              boxShadow: '0 0 10px rgba(251, 192, 45, 0.5)',
            }),
          }}
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
      <MonitoredHighlightContainer highlightTip={highlightTip}>
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
          backgroundColor={HIGHLIGHT_COLOR}
          onContextMenu={onContextMenu ? (e) => onContextMenu(e, highlight) : undefined}
        />
      </MonitoredHighlightContainer>
    );
  } else {
    console.warn('⚠️ Type de highlight inconnu:', highlight.type, highlight);
    return null;
  }
}


export default function PdfAnnotator({
  pdfUrl,
  initialHighlights = [],
  onHighlightsChange,
  authToken,
  pdfScaleValue,
  utilsRef,
}: PdfAnnotatorProps) {
  const [highlights, setHighlights] = useState<EvaluatorHighlight[]>(initialHighlights);
  const currentSelectionRef = useRef<PdfSelection | null>(null);
  const internalUtilsRef = useRef<PdfHighlighterUtils | null>(null);
  const highlighterUtilsRef = utilsRef || internalUtilsRef;

  // Synchroniser les highlights quand initialHighlights change (par ex. après suppression)
  useEffect(() => {
    setHighlights(initialHighlights);
  }, [initialHighlights]);

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
    (comment: string) => {
      if (!currentSelectionRef.current) {
        console.error('Aucune sélection active');
        return;
      }

      const ghostHighlight = currentSelectionRef.current.makeGhostHighlight();

      if (!ghostHighlight.type) {
        console.error('Le highlight n\'a pas de type', ghostHighlight);
        return;
      }

      const newHighlight: EvaluatorHighlight = {
        ...ghostHighlight,
        id: getNextId(),
        comment,
      };

      updateHighlights([newHighlight, ...highlights]);
      currentSelectionRef.current = null;

      // Supprimer le tip (bouton "+") après ajout du commentaire
      if (highlighterUtilsRef.current) {
        highlighterUtilsRef.current.setTip(null);
      }
    },
    [highlights, updateHighlights]
  );

  const handleSelection = useCallback(
    (selection: PdfSelection) => {
      currentSelectionRef.current = selection;
    },
    []
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
            pdfScaleValue={pdfScaleValue}
            selectionTip={<SelectionTip onAddComment={addHighlight} />}
            style={{
              height: '100%',
              width: '100%',
            }}
          >
            <HighlightContainer editHighlight={editHighlight} />
          </PdfHighlighter>
        )}
      </PdfLoader>
    </Box>
  );
}
