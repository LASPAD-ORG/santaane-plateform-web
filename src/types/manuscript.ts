export type ManuscriptStatus = 
  | 'submitted'
  | 're_submitted'
  | 'accepted'
  | 'rejected'
  | 'revision_requested'
  | 'published';

export type EvaluatorStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface Evaluator {
  evaluatorId: number;
  evaluatorName: string;
  evaluatorEmail: string;
  status: EvaluatorStatus;
  assignedAt: string;
  responseAt: string | null;
  evaluationDeadline: string | null;
  evaluationStatus: string; // 'not_started', 'in_progress', 'completed'
}

export interface EvaluationStatus {
  assignedEvaluators: number;
  submittedEvaluations: number;
  isFullyEvaluated: boolean;
  evaluationProgress: number;
}

export interface Manuscript {
  id: number;
  title: string;
  abstract: string;
  keywords: string;
  authorId?: number;
  authorName?: string;
  themeId: number | null;
  themeName: string | null;
  sectionId: number;
  sectionName: string;
  languageId: number;
  languageName: string;
  status: ManuscriptStatus;
  pdfFilename: string;
  docxFilename?: string | null;
  evaluators?: Evaluator[];
  evaluationStatus?: EvaluationStatus;
  isAnonymized?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ManuscriptsResponse {
  manuscripts: Manuscript[];
  total: number;
}

export const MANUSCRIPT_STATUS_LABELS: Record<ManuscriptStatus, string> = {
  submitted: 'En attente d\'évaluation',
  re_submitted: 'Re-soumis',
  accepted: 'Accepté',
  rejected: 'Rejeté',
  revision_requested: 'Accepter provisoirement',
  published: 'Publié',
};
export const MANUSCRIPT_STATUS_COLORS: Record<ManuscriptStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  submitted: 'info',
  re_submitted: 'info',
  accepted: 'success',
  rejected: 'error',
  revision_requested: 'warning',
  published: 'success',
}
