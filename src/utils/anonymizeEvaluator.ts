import type { Evaluator } from '@/types/manuscript';

/**
 * Anonymise le nom de l'évaluateur pour l'auteur
 * Retourne "Évaluateur 1", "Évaluateur 2", etc. au lieu du vrai nom
 *
 * @param evaluators - Liste complète des évaluateurs du manuscrit
 * @param evaluatorId - ID de l'évaluateur à anonymiser
 * @returns "Évaluateur N" où N est la position parmi les évaluateurs ayant terminé
 */
export function getAnonymizedEvaluatorName(
  evaluators: Evaluator[],
  evaluatorId: number
): string {
  // Filtrer seulement les évaluateurs qui ont terminé leur évaluation
  const completedEvaluators = evaluators.filter(
    (e) => e.evaluationStatus === 'completed'
  );

  // Trouver l'index de l'évaluateur dans la liste des évaluations terminées
  const index = completedEvaluators.findIndex((e) => e.evaluatorId === evaluatorId);

  // Si non trouvé, retourner un nom générique
  if (index === -1) {
    return 'Évaluateur';
  }

  // Retourner "Évaluateur 1", "Évaluateur 2", etc.
  // +1 car les index commencent à 0
  return `Évaluateur ${index + 1}`;
}

/**
 * Obtient la liste des évaluateurs ayant terminé leur évaluation,
 * avec leurs noms anonymisés
 *
 * @param evaluators - Liste complète des évaluateurs du manuscrit
 * @returns Liste des évaluateurs terminés avec noms anonymisés
 */
export function getCompletedEvaluatorsWithAnonymizedNames(
  evaluators: Evaluator[]
): Array<Evaluator & { anonymizedName: string }> {
  const completedEvaluators = evaluators.filter(
    (e) => e.evaluationStatus === 'completed'
  );

  return completedEvaluators.map((evaluator, index) => ({
    ...evaluator,
    anonymizedName: `Évaluateur ${index + 1}`,
  }));
}
