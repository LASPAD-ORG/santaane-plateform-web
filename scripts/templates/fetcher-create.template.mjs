export default function getFetcherCreateTemplate(featureName, featureNamePascal) {
  return `import { useState } from 'react';
// import { apiClient } from '@/lib/api/client';
// import { useAlertStore } from '@/stores/alertStore';
import type { ${featureNamePascal}Payload } from '../checkers/validators';
import type { ${featureNamePascal}Item } from './useFetch${featureNamePascal}';

/**
 * Custom hook to create a new ${featureName}
 */
export function useCreate${featureNamePascal}() {
  const [loading, setLoading] = useState(false);
  // const { showSuccess, showError } = useAlertStore();

  const create = async (payload: ${featureNamePascal}Payload): Promise<${featureNamePascal}Item> => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below when ready

      // const response = await apiClient.post('/api/v1/${featureName}', payload);
      // showSuccess('Succès', 'L\\'élément a été créé avec succès');
      // return response.data;

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const mockItem: ${featureNamePascal}Item = {
        id: Math.random().toString(36).substring(7),
        ...payload,
        status: payload.status || 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorId: 'current-user',
      };
      console.log('Mock: Created ${featureName}', mockItem);
      return mockItem;

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de création',
      //   error.response?.data?.message || 'Impossible de créer l\\'élément'
      // );
      console.error('Error creating ${featureName}:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    create,
    loading,
  };
}

/**
 * Custom hook to update an existing ${featureName}
 */
export function useUpdate${featureNamePascal}() {
  const [loading, setLoading] = useState(false);
  // const { showSuccess, showError } = useAlertStore();

  const update = async (id: string, payload: ${featureNamePascal}Payload): Promise<${featureNamePascal}Item> => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below when ready

      // const response = await apiClient.put(\`/api/v1/${featureName}/\${id}\`, payload);
      // showSuccess('Succès', 'L\\'élément a été modifié avec succès');
      // return response.data;

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const mockItem: ${featureNamePascal}Item = {
        id,
        ...payload,
        status: payload.status || 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorId: 'current-user',
      };
      console.log('Mock: Updated ${featureName}', mockItem);
      return mockItem;

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de modification',
      //   error.response?.data?.message || 'Impossible de modifier l\\'élément'
      // );
      console.error('Error updating ${featureName}:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    update,
    loading,
  };
}

/**
 * Custom hook to delete a ${featureName}
 */
export function useDelete${featureNamePascal}() {
  const [loading, setLoading] = useState(false);
  // const { showSuccess, showError } = useAlertStore();

  const deleteItem = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      // TODO: Replace mock implementation with real API call
      // Uncomment the lines below when ready

      // await apiClient.delete(\`/api/v1/${featureName}/\${id}\`);
      // showSuccess('Succès', 'L\\'élément a été supprimé avec succès');

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      console.log('Mock: Deleted ${featureName} with id:', id);

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de suppression',
      //   error.response?.data?.message || 'Impossible de supprimer l\\'élément'
      // );
      console.error('Error deleting ${featureName}:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteItem,
    loading,
  };
}
`;
}
