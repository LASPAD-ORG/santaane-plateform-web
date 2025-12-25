export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface Evaluator {
  id: number;
  email: string;
  fullName: string;
  orcidId: string;
  bio: string;
  position: string;
  institution: string;
  emailVerified: boolean;
  isActive: boolean;
  profilePhoto: string;
  roles: Role[];
  created_at: string;
  updated_at: string;
}

export interface EvaluatorListResponse {
  items: Evaluator[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

export interface CreateEvaluatorRequest {
  email: string;
  fullName: string;
  orcidId?: string;
  bio?: string;
  position?: string;
  institution?: string;
}

// Evaluator Manuscript Assignment Types
export type AssignmentStatus = 'pending' | 'accepted' | 'declined';
export type EvaluationStatus = 'not_started' | 'in_progress' | 'completed';

export interface EvaluatorManuscript {
  id: number;
  title: string;
  abstract: string;
  keywords: string;
  themeName: string;
  sectionName: string;
  languageName: string;
  status: string;
  pdfFilename: string;
  assignmentStatus: AssignmentStatus;
  evaluationStatus?: EvaluationStatus; // Nouvel état pour l'évaluation
  assignedAt: string;
  evaluationDeadline: string | null;
  responseAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluatorResponse {
  accept: boolean;
}

// Types pour react-pdf-highlighter-plus
import type { Highlight as BaseHighlight, ScaledPosition } from 'react-pdf-highlighter-plus';

export interface EvaluatorHighlight extends BaseHighlight {
  type: 'text' | 'area' | 'freetext';
  comment: string;
  author?: string;
}

export interface HighlightWithComment {
  highlight: EvaluatorHighlight;
  timestamp: string;
}

// Helper pour grouper les highlights par page
export function groupHighlightsByPage(
  highlights: EvaluatorHighlight[]
): Map<number, EvaluatorHighlight[]> {
  const grouped = new Map<number, EvaluatorHighlight[]>();

  highlights.forEach(h => {
    const page = h.position.boundingRect.pageNumber;
    if (!grouped.has(page)) {
      grouped.set(page, []);
    }
    grouped.get(page)!.push(h);
  });

  return grouped;
}

// Types pour la persistance des annotations

export interface BackendAnnotation {
  id: string;
  manuscriptId: number;
  evaluatorId: number;
  evaluatorName: string;
  annotationType: string;
  pageNumber: number;
  xPosition: number;
  yPosition: number;
  positionData: string;
  comment: string;
  contentData: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnotationRequest {
  annotationType: string;
  pageNumber: number;
  xPosition: number;
  yPosition: number;
  positionData: string;
  comment: string;
  contentData?: string;
}

export interface UpdateAnnotationRequest {
  comment: string;
}

// Helper pour convertir highlight frontend → backend
export function highlightToBackendAnnotation(
  highlight: EvaluatorHighlight,
  manuscriptId: number
): CreateAnnotationRequest {
  // Sérialiser la position complète (pas de limite maintenant)
  const positionData = JSON.stringify(highlight.position);

  // Sérialiser le contenu (optionnel)
  const contentData = highlight.content
    ? JSON.stringify(highlight.content)
    : undefined;

  return {
    annotationType: highlight.type,
    pageNumber: highlight.position.boundingRect.pageNumber,
    xPosition: highlight.position.boundingRect.x1,
    yPosition: highlight.position.boundingRect.y1,
    positionData: positionData,
    comment: highlight.comment,
    contentData: contentData,
  };
}

// Helper pour convertir annotation backend → highlight frontend
export function backendAnnotationToHighlight(
  annotation: BackendAnnotation
): EvaluatorHighlight {
  try {
    // Parser les données JSON
    const position = JSON.parse(annotation.positionData);
    const content = annotation.contentData
      ? JSON.parse(annotation.contentData)
      : { text: '' };

    return {
      id: String(annotation.id),
      type: annotation.annotationType as 'text' | 'area' | 'freetext',
      comment: annotation.comment,
      position: position,
      content: content,
      author: annotation.evaluatorName,
    };
  } catch (error) {
    console.error('Failed to parse annotation data:', error);

    // Fallback basique
    return {
      id: String(annotation.id),
      type: 'text',
      comment: annotation.comment,
      position: {
        boundingRect: {
          pageNumber: annotation.pageNumber,
          x1: annotation.xPosition,
          y1: annotation.yPosition,
          x2: annotation.xPosition + 100,
          y2: annotation.yPosition + 20,
          width: 100,
          height: 20,
        },
        rects: [],
        pageNumber: annotation.pageNumber,
      },
      content: { text: '' },
      author: annotation.evaluatorName,
    };
  }
}
