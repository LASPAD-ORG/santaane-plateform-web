export type ManuscriptStatus = 
  | 'submitted'
  | 're_submitted'
  | 'under_review'
  | 'revised'
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
  evaluators?: Evaluator[];
  evaluationStatus?: EvaluationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ManuscriptsResponse {
  manuscripts: Manuscript[];
  total: number;
}

export const MANUSCRIPT_STATUS_LABELS: Record<ManuscriptStatus, string> = {
  submitted: 'Soumis',
  re_submitted: 'Re-soumis',
  under_review: 'En révision',
  revised: 'Révisé',
  accepted: 'Accepté',
  rejected: 'Rejeté',
  revision_requested: 'Révision demandée',
  published: 'Publié',
};
export const MANUSCRIPT_STATUS_COLORS: Record<ManuscriptStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  submitted: 'info',
  re_submitted: 'info',
  under_review: 'primary',
  revised: 'secondary',
  accepted: 'success',
  rejected: 'error',
  revision_requested: 'warning',
  published: 'success',
}
