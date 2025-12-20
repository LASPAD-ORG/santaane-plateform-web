'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMentorApi, MentorAssignment } from '@/app/(dashboard)/dashboard/super-admin/gestion-utilisateurs/fetchers/useMentorApi';

/**
 * Hook pour valider les assignations de mentors
 * Vérifie si un auteur a déjà un mentor actif selon la règle métier : 1 auteur = 1 mentor actif
 */
export function useAssignmentValidation() {
  const [assignments, setAssignments] = useState<MentorAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchAllAssignments } = useMentorApi();

  // Charger toutes les assignations
  const loadAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allAssignments = await fetchAllAssignments();
      setAssignments(allAssignments);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des assignations';
      setError(errorMessage);
      console.error('Error loading assignments:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchAllAssignments]);

  // Charger les assignations au montage
  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  /**
   * Vérifie si un auteur a déjà un mentor actif
   * @param authorId - ID de l'auteur à vérifier
   * @returns true si l'auteur a déjà un mentor actif, false sinon
   */
  const hasActiveMentor = useCallback((authorId: number | string): boolean => {
    const authorIdNum = typeof authorId === 'string' ? parseInt(authorId, 10) : authorId;
    return assignments.some(
      assignment => assignment.author_id === authorIdNum && assignment.is_active === true
    );
  }, [assignments]);

  /**
   * Récupère l'assignation active d'un auteur
   * @param authorId - ID de l'auteur
   * @returns L'assignation active ou null si aucune
   */
  const getActiveAssignment = useCallback((authorId: number | string): MentorAssignment | null => {
    const authorIdNum = typeof authorId === 'string' ? parseInt(authorId, 10) : authorId;
    return assignments.find(
      assignment => assignment.author_id === authorIdNum && assignment.is_active === true
    ) || null;
  }, [assignments]);

  /**
   * Valide si une nouvelle assignation est possible
   * @param authorId - ID de l'auteur
   * @returns objet avec isValid et message explicatif
   */
  const validateAssignment = useCallback((authorId: number | string): {
    isValid: boolean;
    message: string;
    activeAssignment?: MentorAssignment;
  } => {
    const activeAssignment = getActiveAssignment(authorId);
    
    if (activeAssignment) {
      return {
        isValid: false,
        message: "Cet auteur possède déjà un mentor actif. Veuillez désactiver l'assignation existante avant d'en créer une nouvelle.",
        activeAssignment
      };
    }
    
    return {
      isValid: true,
      message: ""
    };
  }, [getActiveAssignment]);

  /**
   * Rafraîchit la liste des assignations
   */
  const refreshAssignments = useCallback(() => {
    loadAssignments();
  }, [loadAssignments]);

  return {
    assignments,
    loading,
    error,
    hasActiveMentor,
    getActiveAssignment,
    validateAssignment,
    refreshAssignments
  };
}
