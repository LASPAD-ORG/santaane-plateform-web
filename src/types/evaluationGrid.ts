/**
 * Types for Manuscript Evaluation Grid
 *
 * The evaluation grid allows evaluators to provide structured feedback
 * on manuscripts using standardized criteria.
 */

export type EvaluatorType = 'internal' | 'external';

export type EvaluationRecommendation =
  | 'accepted_with_validation'
  | 'resubmission_required'
  | 'rejected'
  | 'internal_accepted_after_revision'
  | 'internal_to_external'
  | 'internal_rejected';

export interface EvaluationGrid {
  id?: string;
  manuscriptId: number;
  evaluatorId: number;

  articleTitle: string;
  evaluatorName: string;

  originalityOfIdeas?: string;
  methodologyRigor?: string;
  theoreticalApproach?: string;
  presentationClarity?: string;
  strengths?: string;
  weaknesses?: string;
  suggestions?: string;

  editorialLineFit?: string;
  globalOpinion?: string;

  recommendation: EvaluationRecommendation;

  createdAt?: string;
  updatedAt?: string;
  submittedAt?: string | null;
}

export interface SaveEvaluationGridRequest {
  evaluatorType?: EvaluatorType;

  originalityOfIdeas?: string;
  methodologyRigor?: string;
  theoreticalApproach?: string;
  presentationClarity?: string;
  strengths?: string;
  weaknesses?: string;
  suggestions?: string;

  editorialLineFit?: string;
  globalOpinion?: string;

  recommendation: EvaluationRecommendation;
}