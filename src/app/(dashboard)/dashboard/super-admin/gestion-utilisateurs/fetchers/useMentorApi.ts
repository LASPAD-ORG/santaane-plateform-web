'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';

// Types pour les APIs mentors
export interface Mentor {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  roles: string[];
  isActive: boolean;
  laboratoire?: string;
  specialite?: string;
}

export interface Author {
  id: string;
  prenom: string;
  nom: string;
  fullName?: string; // Optionnel, peut venir du backend
  email: string;
  telephone?: string;
  roles: string[];
  isActive: boolean;
  laboratoire?: string;
  specialite?: string;
}

export interface MentorAssignment {
  id: string;
  author_id: number;
  mentor_id: number;
  assigned_by: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  author?: Author;
}

export interface CreateAssignmentData {
  author_id: number;
  mentor_id: number;
}

export interface UpdateAssignmentData {
  mentor_id?: number;
  is_active?: boolean;
}

const API_BASE = '/api/mentors';

/**
 * Hook pour gérer les APIs relatives aux mentors et assignations
 */
export function useMentorApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gestion des erreurs
  const handleError = (error: any) => {
    const message = error.response?.data?.message || error.message || 'Une erreur est survenue';
    setError(message);
    throw error;
  };

  // Réinitialiser l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Récupérer la liste de tous les mentors disponibles
   */
  const fetchMentors = useCallback(async (): Promise<Mentor[]> => {
    try {
      setLoading(true);
      clearError();
      
      const response = await axios.get<{ data: Mentor[] }>(`${API_BASE}?available=true`);
      return response.data.data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Assigner un auteur à un mentor
   */
  const assignAuthorToMentor = useCallback(async (data: CreateAssignmentData): Promise<MentorAssignment> => {
    try {
      setLoading(true);
      clearError();
      
      const response = await axios.post<{ data: MentorAssignment }>(`${API_BASE}/assign`, data);
      return response.data.data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Récupérer les auteurs assignés à un mentor
   */
  const fetchMentorAuthors = useCallback(async (mentorId: string): Promise<Author[]> => {
    try {
      setLoading(true);
      clearError();
      
      // Récupérer les assignations depuis l'API locale qui proxy vers le backend
      const response = await axios.get<{
        items: MentorAssignment[];
        total: number;
        skip: number;
        limit: number;
        has_more: boolean;
      }>(`/api/mentors/${mentorId}/authors?active_only=true`);
      
      const assignments = response.data.items;
      
      // Si les assignations contiennent déjà les détails des auteurs, les retourner directement
      if (assignments.length > 0 && assignments[0].author) {
        return assignments.map(assignment => assignment.author!);
      }
      
      // Sinon, récupérer les détails de chaque auteur depuis l'API users
      const authors: Author[] = [];
      for (const assignment of assignments) {
        try {
          const authorResponse = await axios.get(`/api/users/${assignment.author_id}`);
          const authorData = authorResponse.data;
          
          authors.push({
            id: authorData.id.toString(),
            prenom: authorData.fullName?.split(' ')[0] || 'Inconnu',
            nom: authorData.fullName?.split(' ').slice(1).join(' ') || 'Auteur',
            fullName: authorData.fullName || authorData.full_name,
            email: authorData.email || '',
            telephone: authorData.telephone,
            roles: authorData.roles?.map((r: any) => r.name) || ['AUTHOR'],
            isActive: authorData.isActive,
            laboratoire: authorData.laboratoire,
            specialite: authorData.specialite,
          });
        } catch (authorError) {
          console.error(`Error fetching author ${assignment.author_id}:`, authorError);
          // Ajouter un auteur par défaut pour éviter les erreurs d'affichage
          authors.push({
            id: assignment.author_id.toString(),
            prenom: 'Inconnu',
            nom: 'Auteur',
            fullName: 'Inconnu Auteur',
            email: '',
            telephone: undefined,
            roles: ['AUTHOR'],
            isActive: assignment.is_active,
            laboratoire: undefined,
            specialite: undefined,
          });
        }
      }
      
      return authors;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Récupérer toutes les assignations
   */
  const fetchAllAssignments = useCallback(async (): Promise<MentorAssignment[]> => {
    try {
      setLoading(true);
      clearError();
      
      const response = await axios.get<{
        items: MentorAssignment[];
        total: number;
        skip: number;
        limit: number;
        has_more: boolean;
      }>(`/api/mentors/assign`);
      return response.data.items;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Mettre à jour une assignation
   */
  const updateAssignment = useCallback(async (
    assignmentId: string, 
    data: UpdateAssignmentData
  ): Promise<MentorAssignment> => {
    try {
      setLoading(true);
      clearError();
      
      const response = await axios.put<MentorAssignment>(`/api/mentors/assign/${assignmentId}`, data);
      return response.data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Supprimer une assignation
   */
  const deleteAssignment = useCallback(async (assignmentId: string): Promise<void> => {
    try {
      setLoading(true);
      clearError();
      
      await axios.delete(`/api/mentors/assign/${assignmentId}`);
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Récupérer une assignation par son ID
   */
  const fetchAssignmentById = useCallback(async (assignmentId: string): Promise<MentorAssignment> => {
    try {
      setLoading(true);
      clearError();
      
      const response = await axios.get<MentorAssignment>(`/api/mentors/assign/${assignmentId}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  return {
    loading,
    error,
    clearError,
    fetchMentors,
    assignAuthorToMentor,
    fetchMentorAuthors,
    fetchAllAssignments,
    updateAssignment,
    deleteAssignment,
    fetchAssignmentById,
  };
}
