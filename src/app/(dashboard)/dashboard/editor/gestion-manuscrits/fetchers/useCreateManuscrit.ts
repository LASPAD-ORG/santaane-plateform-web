import { useState } from 'react';
import type { ManuscritPayload } from '../checkers/validators';
import type { ManuscritItem } from './useFetchManuscrits';

export function useCreateManuscrit() {
  const [loading, setLoading] = useState(false);

  const create = async (payload: ManuscritPayload): Promise<ManuscritItem | null> => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/manuscripts
      // const response = await apiClient.post('/editor/manuscripts', payload);
      // return response.data;

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newManuscrit: ManuscritItem = {
        id: String(Date.now()),
        ...payload,
        version: 1,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Manuscrit créé (mock):', newManuscrit);
      return newManuscrit;
    } catch (error) {
      console.error('Error creating manuscrit:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}

export function useUpdateManuscrit() {
  const [loading, setLoading] = useState(false);

  const update = async (
    id: string,
    payload: Partial<ManuscritPayload>
  ): Promise<ManuscritItem | null> => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/manuscripts/:id
      // const response = await apiClient.put(`/editor/manuscripts/${id}`, payload);
      // return response.data;

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('Manuscrit mis à jour (mock):', { id, payload });
      return null;
    } catch (error) {
      console.error('Error updating manuscrit:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}

export function useDeleteManuscrit() {
  const [loading, setLoading] = useState(false);

  const deleteItem = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/manuscripts/:id
      // await apiClient.delete(`/editor/manuscripts/${id}`);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('Manuscrit supprimé (mock):', id);
      return true;
    } catch (error) {
      console.error('Error deleting manuscrit:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading };
}

export function useAssignReviewer() {
  const [loading, setLoading] = useState(false);

  const assign = async (
    manuscriptId: string,
    reviewerId: string,
    dueDate?: string,
    message?: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/manuscripts/:id/assign-reviewer
      // await apiClient.post(`/editor/manuscripts/${manuscriptId}/assign-reviewer`, {
      //   reviewerId,
      //   dueDate,
      //   invitationMessage: message,
      // });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('Évaluateur assigné (mock):', {
        manuscriptId,
        reviewerId,
        dueDate,
        message,
      });
      return true;
    } catch (error) {
      console.error('Error assigning reviewer:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { assign, loading };
}

export function useAssignMentor() {
  const [loading, setLoading] = useState(false);

  const assign = async (manuscriptId: string, mentorId: string): Promise<boolean> => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/manuscripts/:id/assign-mentor
      // await apiClient.post(`/editor/manuscripts/${manuscriptId}/assign-mentor`, {
      //   mentorId,
      // });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('Mentor assigné (mock):', { manuscriptId, mentorId });
      return true;
    } catch (error) {
      console.error('Error assigning mentor:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { assign, loading };
}

export function useSubmitDecision() {
  const [loading, setLoading] = useState(false);

  const submit = async (
    manuscriptId: string,
    decision: string,
    decisionLetter: string,
    internalNotes?: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/manuscripts/:id/decision
      // await apiClient.post(`/editor/manuscripts/${manuscriptId}/decision`, {
      //   decision,
      //   decisionLetter,
      //   internalNotes,
      // });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('Décision soumise (mock):', {
        manuscriptId,
        decision,
        decisionLetter,
        internalNotes,
      });
      return true;
    } catch (error) {
      console.error('Error submitting decision:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
}
