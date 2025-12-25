'use client';

import React from 'react';
import {
  AreaHighlight,
  useHighlightContainerContext,
  MonitoredHighlightContainer,
  type ViewportHighlight,
  type Highlight,
} from 'react-pdf-highlighter-plus';
import type { RedactionMask } from '@/services/redactionViewerService';

// Interface pour les masques de redaction dans le highlighter
export interface RedactionMaskHighlight extends Highlight {
  id: string;
  type: 'area'; // Utiliser 'area' au lieu de 'redaction-mask' pour compatibilité
  isRedactionMask?: true; // Flag pour identifier un masque de redaction
  comment: string; // Requis par l'interface Highlight
  content: { text: string; image?: string }; // Requis par l'interface Highlight
  position: {
    boundingRect: {
      pageNumber: number;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
    };
    rects: any[];
  };
}

// Composant pour rendre un masque de redaction
function RedactionMaskContainer() {
  const { highlight } = useHighlightContainerContext<RedactionMaskHighlight>();

  return (
    <MonitoredHighlightContainer>
      <AreaHighlight
        highlight={highlight}
        isScrolledTo={false}
        style={{
          backgroundColor: '#000000', // Masque noir complet
          border: 'none',
          opacity: 1, // Complètement opaque pour cacher le contenu
          cursor: 'not-allowed',
          pointerEvents: 'none', // Empêcher les interactions
        }}
        onChange={() => {
          // Les masques de redaction ne sont pas modifiables
        }}
        bounds={undefined}
      />
    </MonitoredHighlightContainer>
  );
}

// Fonction utilitaire pour convertir RedactionMask en RedactionMaskHighlight
export function redactionMaskToHighlight(mask: RedactionMask): RedactionMaskHighlight {
  try {
    const position = JSON.parse(mask.positionData);
    return {
      id: mask.id,
      type: 'area',
      isRedactionMask: true, // Flag pour identifier un masque
      position: position,
      content: { text: '' }, // Contenu vide requis par l'interface
      comment: '', // Commentaire vide requis par l'interface
    };
  } catch (error) {
    console.error('Failed to parse redaction mask position data:', error);
    // Fallback: créer un rectangle minimal
    return {
      id: mask.id,
      type: 'area',
      isRedactionMask: true,
      position: {
        boundingRect: {
          pageNumber: mask.pageNumber,
          x1: 0,
          y1: 0,
          x2: 100,
          y2: 20,
          width: 100,
          height: 20,
        },
        rects: [],
      },
      content: { text: '' },
      comment: '',
    };
  }
}

export { RedactionMaskContainer };