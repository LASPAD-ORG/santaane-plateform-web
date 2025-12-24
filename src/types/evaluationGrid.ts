/**
 * Types for Manuscript Evaluation Grid
 *
 * The evaluation grid allows evaluators to provide structured feedback
 * on manuscripts using standardized criteria.
 */

export interface EvaluationGrid {
  id?: string;                          // ID généré par backend (optionnel pour création)
  manuscriptId: number;                 // ID du manuscrit
  evaluatorId: number;                  // ID de l'évaluateur

  // Champs auto-remplis (lecture seule dans le formulaire)
  articleTitle: string;                 // Titre du manuscrit
  evaluatorName: string;                // Nom de l'évaluateur

  // Champs éditables (critères d'évaluation)
  originalityOfIdeas: string;           // Originalité des idées et des conclusions
  methodologyRigor: string;             // Pertinence et rigueur de la méthode
  theoreticalApproach: string;          // Recours à des études empiriques et approche théorique
  presentationClarity: string;          // Soin dans la présentation et clarté
  strengths: string;                    // Points forts
  weaknesses: string;                   // Points faibles
  suggestions: string;                  // Suggestions pour améliorer le texte

  // Avis final (select)
  recommendation: 'accepted_with_validation' | 'resubmission_required' | 'rejected';

  // Métadonnées
  createdAt?: string;                   // ISO 8601
  updatedAt?: string;                   // ISO 8601
  submittedAt?: string | null;          // Date de soumission finale (null si brouillon)
}

// Request pour créer/mettre à jour
export interface SaveEvaluationGridRequest {
  originalityOfIdeas: string;
  methodologyRigor: string;
  theoreticalApproach: string;
  presentationClarity: string;
  strengths: string;
  weaknesses: string;
  suggestions: string;
  recommendation: 'accepted_with_validation' | 'resubmission_required' | 'rejected';
}
