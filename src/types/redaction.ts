/**
 * Types for manuscript redaction (anonymization) system
 * EDITOR-only feature for anonymizing manuscripts before evaluator assignment
 */

import type { Highlight as BaseHighlight } from 'react-pdf-highlighter-plus';

/**
 * Frontend redaction highlight (used in react-pdf-highlighter-plus)
 * Uses type='area' (required by library), identified by presence of 'isRedaction' flag
 */
export interface RedactionHighlight extends BaseHighlight {
  type: 'area';
  isRedaction: true;
  comment: string;
  author?: string;
}

/**
 * Backend redaction response from API
 */
export interface BackendRedaction {
  id: string;
  manuscriptId: number;
  editorId: number;
  editorName: string;
  annotationType: 'redaction';
  pageNumber: number;
  xPosition: number;
  yPosition: number;
  positionData: string;
  comment: string;
  contentData: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request payload for creating redaction
 */
export interface CreateRedactionRequest {
  annotationType: 'redaction';
  pageNumber: number;
  xPosition: number;
  yPosition: number;
  positionData: string;
  comment: string;
  contentData?: string;
}

/**
 * Request payload for updating redaction
 */
export interface UpdateRedactionRequest {
  comment: string;
}

/**
 * Request payload for marking manuscript as anonymized
 */
export interface AnonymizationStatusRequest {
  confirmAnonymized?: boolean;
}

/**
 * Response for anonymization status
 */
export interface AnonymizationStatusResponse {
  manuscriptId: number;
  isAnonymized: boolean;
  anonymizedAt: string | null;
  anonymizedByName: string | null;
  redactionCount: number;
}

/**
 * Helper: Convert frontend redaction highlight → backend API request
 */
export function highlightToBackendRedaction(
  highlight: RedactionHighlight,
  manuscriptId: number
): CreateRedactionRequest {
  // Serialize position data (full ScaledPosition object)
  const positionData = JSON.stringify(highlight.position);

  // Serialize content if present (usually empty for area redactions)
  const contentData = highlight.content
    ? JSON.stringify(highlight.content)
    : undefined;

  return {
    annotationType: 'redaction',
    pageNumber: highlight.position.boundingRect.pageNumber,
    xPosition: highlight.position.boundingRect.x1,
    yPosition: highlight.position.boundingRect.y1,
    positionData: positionData,
    comment: highlight.comment,
    contentData: contentData,
  };
}

/**
 * Helper: Convert backend redaction → frontend highlight
 */
export function backendRedactionToHighlight(
  redaction: BackendRedaction
): RedactionHighlight {
  try {
    // Parse JSON data
    const position = JSON.parse(redaction.positionData);
    const content = redaction.contentData
      ? JSON.parse(redaction.contentData)
      : { text: '' };

    return {
      id: String(redaction.id),
      type: 'area',
      isRedaction: true,
      comment: redaction.comment,
      position: position,
      content: content,
      author: redaction.editorName,
    };
  } catch (error) {
    console.error('Failed to parse redaction data:', error);

    // Fallback: create basic redaction rectangle
    return {
      id: String(redaction.id),
      type: 'area',
      isRedaction: true,
      comment: redaction.comment,
      position: {
        boundingRect: {
          pageNumber: redaction.pageNumber,
          x1: redaction.xPosition,
          y1: redaction.yPosition,
          x2: redaction.xPosition + 150,
          y2: redaction.yPosition + 30,
          width: 150,
          height: 30,
        },
        rects: [],
      },
      content: { text: '' },
      author: redaction.editorName,
    };
  }
}

/**
 * Helper: Group redactions by page number
 */
export function groupRedactionsByPage(
  redactions: RedactionHighlight[]
): Map<number, RedactionHighlight[]> {
  const grouped = new Map<number, RedactionHighlight[]>();

  redactions.forEach(r => {
    const page = r.position.boundingRect.pageNumber;
    if (!grouped.has(page)) {
      grouped.set(page, []);
    }
    grouped.get(page)!.push(r);
  });

  return grouped;
}
