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
  category?: 'positive' | 'negative' | 'question' | 'suggestion';
  author?: string;
}

export interface HighlightWithComment {
  highlight: EvaluatorHighlight;
  timestamp: string;
}
