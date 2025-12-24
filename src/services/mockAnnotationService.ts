/**
 * Mock Annotation Service - Frontend-only persistence using localStorage
 *
 * This service simulates backend API calls for manuscript annotations
 * Data is stored in browser localStorage for testing purposes
 *
 * Migration: Replace this with real annotationService.ts when backend is ready
 */

import type {
  BackendAnnotation,
  CreateAnnotationRequest,
  UpdateAnnotationRequest
} from '@/types/evaluator';

/**
 * Simulates network delay (200-500ms)
 */
const simulateNetworkDelay = (): Promise<void> => {
  const delay = Math.random() * 300 + 200; // 200-500ms
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Simulates occasional network errors (1% chance)
 */
const simulateNetworkError = (): void => {
  if (Math.random() < 0.01) { // 1% error rate
    throw new Error('Erreur réseau simulée');
  }
};

/**
 * Generates a unique mock ID
 */
const generateMockId = (): string => {
  return `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Gets localStorage key for a manuscript's annotations
 */
const getStorageKey = (manuscriptId: number): string => {
  return `annotations_manuscript_${manuscriptId}`;
};

/**
 * Retrieves annotations from localStorage
 */
const getAnnotationsFromStorage = (manuscriptId: number): BackendAnnotation[] => {
  try {
    // Check if localStorage is available (SSR safety)
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }

    const key = getStorageKey(manuscriptId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading annotations from localStorage:', error);
    return [];
  }
};

/**
 * Saves annotations to localStorage
 */
const saveAnnotationsToStorage = (manuscriptId: number, annotations: BackendAnnotation[]): void => {
  try {
    // Check if localStorage is available (SSR safety)
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage not available (SSR context)');
      return;
    }

    const key = getStorageKey(manuscriptId);
    localStorage.setItem(key, JSON.stringify(annotations));
  } catch (error) {
    console.error('Error saving annotations to localStorage:', error);
    throw new Error('Impossible de sauvegarder les annotations');
  }
};

/**
 * Mock Annotation Service
 */
export const mockAnnotationService = {
  /**
   * Get all annotations for a manuscript
   */
  async getAnnotations(manuscriptId: number): Promise<BackendAnnotation[]> {
    await simulateNetworkDelay();
    simulateNetworkError();

    const annotations = getAnnotationsFromStorage(manuscriptId);
    return annotations;
  },

  /**
   * Create a new annotation
   */
  async createAnnotation(
    manuscriptId: number,
    data: CreateAnnotationRequest
  ): Promise<BackendAnnotation> {
    await simulateNetworkDelay();
    simulateNetworkError();

    // Get existing annotations
    const annotations = getAnnotationsFromStorage(manuscriptId);

    // Create new annotation with mock data
    const newAnnotation: BackendAnnotation = {
      id: generateMockId(),
      manuscriptId,
      evaluatorId: 999, // Mock evaluator ID
      evaluatorName: 'Utilisateur Test', // Mock evaluator name
      annotationType: data.annotationType,
      pageNumber: data.pageNumber,
      xPosition: data.xPosition,
      yPosition: data.yPosition,
      positionData: data.positionData,
      comment: data.comment,
      contentData: data.contentData || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to array and save
    annotations.push(newAnnotation);
    saveAnnotationsToStorage(manuscriptId, annotations);

    return newAnnotation;
  },

  /**
   * Update an existing annotation
   */
  async updateAnnotation(
    annotationId: string,
    data: UpdateAnnotationRequest
  ): Promise<BackendAnnotation> {
    await simulateNetworkDelay();
    simulateNetworkError();

    // Find the annotation across all manuscripts
    // (In real backend, you'd query by ID directly)
    let foundAnnotation: BackendAnnotation | null = null;
    let manuscriptId: number | null = null;

    // Search in all stored manuscripts
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('annotations_manuscript_')) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const annotations: BackendAnnotation[] = JSON.parse(stored);
          const annotation = annotations.find(a => a.id === annotationId);
          if (annotation) {
            foundAnnotation = annotation;
            manuscriptId = annotation.manuscriptId;
            break;
          }
        }
      }
    }

    if (!foundAnnotation || manuscriptId === null) {
      throw new Error('Annotation non trouvée');
    }

    // Get all annotations for this manuscript
    const annotations = getAnnotationsFromStorage(manuscriptId);

    // Find and update the annotation
    const index = annotations.findIndex(a => a.id === annotationId);
    if (index === -1) {
      throw new Error('Annotation non trouvée');
    }

    // Update the annotation
    annotations[index] = {
      ...annotations[index],
      comment: data.comment,
      updatedAt: new Date().toISOString(),
    };

    // Save back to storage
    saveAnnotationsToStorage(manuscriptId, annotations);

    return annotations[index];
  },

  /**
   * Delete an annotation
   */
  async deleteAnnotation(annotationId: string): Promise<void> {
    await simulateNetworkDelay();
    simulateNetworkError();

    // Find the annotation across all manuscripts
    let manuscriptId: number | null = null;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('annotations_manuscript_')) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const annotations: BackendAnnotation[] = JSON.parse(stored);
          const annotation = annotations.find(a => a.id === annotationId);
          if (annotation) {
            manuscriptId = annotation.manuscriptId;
            break;
          }
        }
      }
    }

    if (manuscriptId === null) {
      throw new Error('Annotation non trouvée');
    }

    // Get all annotations for this manuscript
    const annotations = getAnnotationsFromStorage(manuscriptId);

    // Filter out the deleted annotation
    const filtered = annotations.filter(a => a.id !== annotationId);

    if (filtered.length === annotations.length) {
      throw new Error('Annotation non trouvée');
    }

    // Save back to storage
    saveAnnotationsToStorage(manuscriptId, filtered);
  },

  /**
   * Clear all annotations for a manuscript (utility function for testing)
   */
  async clearAllAnnotations(manuscriptId: number): Promise<void> {
    const key = getStorageKey(manuscriptId);
    localStorage.removeItem(key);
  },
};
