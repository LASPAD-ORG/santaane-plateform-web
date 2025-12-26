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
import { 
  RedactionMaskContainer, 
  RedactionMaskHighlight, 
  redactionMaskToHighlight 
} from './RedactionMask';
import type { RedactionMask } from '@/services/redactionViewerService';

interface PdfAnnotatorProps {
  pdfUrl: string;
  initialHighlights?: EvaluatorHighlight[];
  onHighlightsChange?: (highlights: EvaluatorHighlight[]) => void;
  authToken?: string;
  pdfScaleValue?: number | string;
  utilsRef?: React.MutableRefObject<PdfHighlighterUtils | null>;
  redactionMasks?: RedactionMask[]; // NOUVEAU: masques de redaction à afficher en noir
  annotationEnabled?: boolean; // NOUVEAU: contrôle si l'annotation est autorisée
}

// Couleur unique pour tous les highlights (jaune)
const HIGHLIGHT_COLOR = 'rgba(255, 235, 59, 0.4)';
// Couleur pour les masques de redaction (noir opaque)
const REDACTION_MASK_COLOR = '#000000';

const getNextId = () => String(Math.random()).slice(2);

// Composant pour rendre un highlight (annotation) ou un masque de redaction
function HighlightContainer({
  editHighlight,
  onContextMenu,
}: {
  editHighlight: (id: string, edit: Partial<EvaluatorHighlight>) => void;
  onContextMenu?: (event: MouseEvent<HTMLDivElement>, highlight: ViewportHighlight<EvaluatorHighlight | RedactionMaskHighlight>) => void;
}) {
  const { highlight, isScrolledTo, viewportToScaled, screenshot, highlightBindings } =
    useHighlightContainerContext<EvaluatorHighlight | RedactionMaskHighlight>();
  const { toggleEditInProgress } = usePdfHighlighterContext();

  // Si c'est un masque de redaction, utiliser le style spécialisé
  const isRedactionMask = 'isRedactionMask' in highlight && highlight.isRedactionMask;

  if (isRedactionMask) {
    // Créer un highlight modifié avec la couleur noire pour l'export
    const blackRedactionHighlight = {
      ...highlight,
      highlightColor: REDACTION_MASK_COLOR,
    };
    
    return (
      <div data-redaction="true" className="redaction-mask-area">
        <MonitoredHighlightContainer>
          <AreaHighlight
            highlight={blackRedactionHighlight}
            isScrolledTo={false}
            style={{
              backgroundColor: `${REDACTION_MASK_COLOR} !important`,
              background: `${REDACTION_MASK_COLOR} !important`,
              border: 'none',
              opacity: 1,
              cursor: 'not-allowed',
              pointerEvents: 'none',
            }}
            onChange={() => {}}
            bounds={undefined}
          />
        </MonitoredHighlightContainer>
      </div>
    );
  }

  const evaluatorHighlight = highlight as ViewportHighlight<EvaluatorHighlight>;

  // Créer le tooltip avec le commentaire (seulement pour les annotations normales)
  const highlightTip = {
    position: evaluatorHighlight.position,
    content: <HighlightTooltip comment={evaluatorHighlight.comment} />,
  };

  if (evaluatorHighlight.type === 'text') {
    return (
      <MonitoredHighlightContainer highlightTip={highlightTip}>
        <TextHighlight
          highlight={evaluatorHighlight}
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
  } else if (evaluatorHighlight.type === 'area') {
    return (
      <MonitoredHighlightContainer highlightTip={highlightTip}>
        <AreaHighlight
          highlight={evaluatorHighlight}
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
            editHighlight(evaluatorHighlight.id, {
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
  } else if (evaluatorHighlight.type === 'freetext') {
    return (
      <MonitoredHighlightContainer highlightTip={highlightTip}>
        <FreetextHighlight
          highlight={evaluatorHighlight}
          isScrolledTo={isScrolledTo}
          onChange={(boundingRect) => {
            editHighlight(evaluatorHighlight.id, {
              position: {
                boundingRect: viewportToScaled(boundingRect),
                rects: [],
              },
            });
            toggleEditInProgress(false);
          }}
          onTextChange={(newText) => {
            editHighlight(evaluatorHighlight.id, {
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
    console.warn('⚠️ Type de highlight inconnu:', evaluatorHighlight.type, evaluatorHighlight);
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
  redactionMasks = [], // NOUVEAU: masques de redaction
  annotationEnabled = true, // NOUVEAU: contrôle si l'annotation est autorisée
}: PdfAnnotatorProps) {
  const [highlights, setHighlights] = useState<EvaluatorHighlight[]>(initialHighlights);
  const currentSelectionRef = useRef<PdfSelection | null>(null);
  const internalUtilsRef = useRef<PdfHighlighterUtils | null>(null);
  const highlighterUtilsRef = utilsRef || internalUtilsRef;

  // Convertir les masques de redaction en highlights
  const redactionMaskHighlights: RedactionMaskHighlight[] = redactionMasks.map(redactionMaskToHighlight);

  // Combiner les annotations normales et les masques de redaction
  // IMPORTANT: Mettre les masques EN DERNIER pour qu'ils soient au-dessus
  const allHighlights: (EvaluatorHighlight | RedactionMaskHighlight)[] = [
    ...highlights,
    ...redactionMaskHighlights,
  ];

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
      if (!annotationEnabled) {
        console.warn('L\'annotation n\'est pas autorisée');
        return;
      }

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
        type: ghostHighlight.type as 'text' | 'area' | 'freetext',
      };

      updateHighlights([newHighlight, ...highlights]);
      currentSelectionRef.current = null;

      // Supprimer le tip (bouton "+") après ajout du commentaire
      if (highlighterUtilsRef.current) {
        highlighterUtilsRef.current.setTip(null);
      }
    },
    [highlights, updateHighlights, annotationEnabled]
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
            highlights={allHighlights} // Utiliser les highlights combinés (annotations + masques)
            onSelection={handleSelection}
            enableAreaSelection={(e) => e.altKey}
            utilsRef={(utils) => {
              highlighterUtilsRef.current = utils;
            }}
            pdfScaleValue={pdfScaleValue as any}
            selectionTip={annotationEnabled ? <SelectionTip onAddComment={addHighlight} /> : null}
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
