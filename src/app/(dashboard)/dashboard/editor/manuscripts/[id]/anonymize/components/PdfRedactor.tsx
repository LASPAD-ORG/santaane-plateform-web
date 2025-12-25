'use client';

import React, { useState, useCallback, useRef, MouseEvent, useEffect } from 'react';
import {
  PdfLoader,
  PdfHighlighter,
  AreaHighlight,
  useHighlightContainerContext,
  usePdfHighlighterContext,
  MonitoredHighlightContainer,
  type PdfSelection,
  type PdfHighlighterUtils,
  type ViewportHighlight,
} from 'react-pdf-highlighter-plus';
import 'pdfjs-dist/web/pdf_viewer.css';
import 'react-pdf-highlighter-plus/style/style.css';
import { Box } from '@mui/material';
import type { RedactionHighlight } from '@/types/redaction';
import { RedactionSelectionTip } from './RedactionSelectionTip';
import { HighlightTooltip } from '@/app/(dashboard)/dashboard/evaluator/manuscripts/[id]/evaluate/components/HighlightTooltip';

interface PdfRedactorProps {
  pdfUrl: string;
  initialRedactions?: RedactionHighlight[];
  onRedactionsChange?: (redactions: RedactionHighlight[]) => void;
  authToken?: string;
  pdfScaleValue?: number | string;
  utilsRef?: React.MutableRefObject<PdfHighlighterUtils | null>;
  viewAnonymized?: boolean; // Toggle to preview anonymized version
}

/**
 * Redaction styles:
 * - Normal mode (viewAnonymized=false): Semi-transparent red to show where redactions are
 * - Anonymized mode (viewAnonymized=true): Solid black to simulate evaluator view
 */
const getRedactionStyle = (viewAnonymized: boolean, isScrolledTo: boolean) => {
  if (viewAnonymized) {
    // Anonymized view: solid black (as evaluators will see)
    return {
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      border: '2px solid #000',
      transition: 'all 0.3s ease-in-out',
      ...(isScrolledTo && {
        border: '3px solid #333',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
      }),
    };
  } else {
    // Editor view: semi-transparent red to show redaction zones
    return {
      backgroundColor: 'rgba(211, 47, 47, 0.3)',
      border: '2px solid #d32f2f',
      transition: 'all 0.3s ease-in-out',
      ...(isScrolledTo && {
        backgroundColor: 'rgba(211, 47, 47, 0.5)',
        border: '3px solid #d32f2f',
        boxShadow: '0 0 10px rgba(211, 47, 47, 0.5)',
      }),
    };
  }
};

const getNextId = () => String(Math.random()).slice(2);

// Component to render a redaction highlight
function RedactionContainer({
  editRedaction,
  onContextMenu,
  viewAnonymized,
}: {
  editRedaction: (id: string, edit: Partial<RedactionHighlight>) => void;
  onContextMenu?: (event: MouseEvent<HTMLDivElement>, highlight: ViewportHighlight<RedactionHighlight>) => void;
  viewAnonymized: boolean;
}) {
  const { highlight, isScrolledTo, viewportToScaled, screenshot, highlightBindings } =
    useHighlightContainerContext<RedactionHighlight>();
  const { toggleEditInProgress } = usePdfHighlighterContext();

  // Tooltip with redaction comment
  const highlightTip = {
    position: highlight.position,
    content: <HighlightTooltip comment={highlight.comment} />,
  };

  // Redactions are always 'area' type (rectangle zones)
  return (
    <MonitoredHighlightContainer highlightTip={highlightTip}>
      <AreaHighlight
        highlight={highlight}
        isScrolledTo={isScrolledTo}
        style={getRedactionStyle(viewAnonymized, isScrolledTo)}
        onChange={(boundingRect) => {
          editRedaction(highlight.id, {
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
}

export default function PdfRedactor({
  pdfUrl,
  initialRedactions = [],
  onRedactionsChange,
  authToken,
  pdfScaleValue,
  utilsRef,
  viewAnonymized = false,
}: PdfRedactorProps) {
  const [redactions, setRedactions] = useState<RedactionHighlight[]>(initialRedactions);
  const currentSelectionRef = useRef<PdfSelection | null>(null);
  const internalUtilsRef = useRef<PdfHighlighterUtils | null>(null);
  const highlighterUtilsRef = utilsRef || internalUtilsRef;

  // Sync redactions when initialRedactions change (e.g., after deletion)
  useEffect(() => {
    setRedactions(initialRedactions);
  }, [initialRedactions]);

  const updateRedactions = useCallback(
    (newRedactions: RedactionHighlight[]) => {
      setRedactions(newRedactions);
      onRedactionsChange?.(newRedactions);
    },
    [onRedactionsChange]
  );

  const editRedaction = useCallback(
    (id: string, edit: Partial<RedactionHighlight>) => {
      const updated = redactions.map((r) => (r.id === id ? { ...r, ...edit } : r));
      updateRedactions(updated);
    },
    [redactions, updateRedactions]
  );

  const addRedaction = useCallback(
    (comment: string) => {
      if (!currentSelectionRef.current) {
        console.error('No active selection');
        return;
      }

      const ghostHighlight = currentSelectionRef.current.makeGhostHighlight();

      // Force type to 'redaction'
      const newRedaction: RedactionHighlight = {
        ...ghostHighlight,
        id: getNextId(),
        type: 'redaction',
        comment,
      };

      updateRedactions([newRedaction, ...redactions]);
      currentSelectionRef.current = null;

      // Remove the tip (selection button) after adding comment
      if (highlighterUtilsRef.current) {
        highlighterUtilsRef.current.setTip(null);
      }
    },
    [redactions, updateRedactions]
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
            highlights={redactions}
            onSelection={handleSelection}
            enableAreaSelection={(e) => e.altKey} // Alt+Drag to create redaction zones
            utilsRef={(utils) => {
              highlighterUtilsRef.current = utils;
            }}
            pdfScaleValue={pdfScaleValue}
            selectionTip={<RedactionSelectionTip onAddRedaction={addRedaction} />}
            style={{
              height: '100%',
              width: '100%',
            }}
          >
            <RedactionContainer
              editRedaction={editRedaction}
              viewAnonymized={viewAnonymized}
            />
          </PdfHighlighter>
        )}
      </PdfLoader>
    </Box>
  );
}
