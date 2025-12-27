/**
 * Mock Evaluation Grid Service - Frontend-only persistence using localStorage
 *
 * This service simulates backend API calls for evaluation grids
 * Data is stored in browser localStorage for testing purposes
 *
 * Migration: Replace this with real evaluationGridService.ts when backend is ready
 */

import type { EvaluationGrid, SaveEvaluationGridRequest } from '@/types/evaluationGrid';
import { useAuthStore } from '@/stores/authStore';

/**
 * Simulates network delay (200-500ms)
 */
const simulateNetworkDelay = (): Promise<void> => {
  const delay = Math.random() * 300 + 200; // 200-500ms
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Generates a unique mock ID
 */
const generateMockId = (): string => {
  return `mock_grid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Gets localStorage key for a manuscript's evaluation grid
 */
const getStorageKey = (manuscriptId: number): string => {
  return `evaluation_grid_manuscript_${manuscriptId}`;
};

/**
 * Retrieves evaluation grid from localStorage
 */
const getGridFromStorage = (manuscriptId: number): EvaluationGrid | null => {
  try {
    // Check if localStorage is available (SSR safety)
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    const key = getStorageKey(manuscriptId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading evaluation grid from localStorage:', error);
    return null;
  }
};

/**
 * Saves evaluation grid to localStorage
 */
const saveGridToStorage = (manuscriptId: number, grid: EvaluationGrid): void => {
  try {
    // Check if localStorage is available (SSR safety)
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage not available (SSR context)');
      return;
    }

    const key = getStorageKey(manuscriptId);
    localStorage.setItem(key, JSON.stringify(grid));
  } catch (error) {
    console.error('Error saving evaluation grid to localStorage:', error);
    throw new Error('Impossible de sauvegarder la grille d\'évaluation');
  }
};

/**
 * Mock Evaluation Grid Service
 */
export const mockEvaluationGridService = {
  /**
   * Get evaluation grid for a manuscript
   */
  async getEvaluationGrid(manuscriptId: number): Promise<EvaluationGrid | null> {
    await simulateNetworkDelay();

    const grid = getGridFromStorage(manuscriptId);
    return grid;
  },

  /**
   * Save (create or update) evaluation grid
   */
  async saveEvaluationGrid(
    manuscriptId: number,
    data: SaveEvaluationGridRequest,
    articleTitle: string = '',
    evaluatorName: string = ''
  ): Promise<EvaluationGrid> {
    await simulateNetworkDelay();

    // Get existing grid or create new one
    let existingGrid = getGridFromStorage(manuscriptId);

    // Get evaluator info from authStore
    const authState = useAuthStore.getState();
    const evaluatorId = authState.user?.id ? parseInt(authState.user.id) : 0;
    const defaultEvaluatorName = authState.user?.fullName || 'Évaluateur';

    const grid: EvaluationGrid = {
      id: existingGrid?.id || generateMockId(),
      manuscriptId,
      evaluatorId,
      articleTitle: existingGrid?.articleTitle || articleTitle,
      evaluatorName: existingGrid?.evaluatorName || evaluatorName || defaultEvaluatorName,
      originalityOfIdeas: data.originalityOfIdeas,
      methodologyRigor: data.methodologyRigor,
      theoreticalApproach: data.theoreticalApproach,
      presentationClarity: data.presentationClarity,
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      suggestions: data.suggestions,
      recommendation: data.recommendation,
      createdAt: existingGrid?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submittedAt: existingGrid?.submittedAt || null,
    };

    // Save to storage
    saveGridToStorage(manuscriptId, grid);

    return grid;
  },

  /**
   * Clear evaluation grid for a manuscript (utility function for testing)
   */
  async clearEvaluationGrid(manuscriptId: number): Promise<void> {
    const key = getStorageKey(manuscriptId);
    localStorage.removeItem(key);
  },
};
