import { useState } from 'react';
import type { CategoryPayload } from '../checkers/validators';
import type { CategoryItem } from './useFetchCategories';

export function useCreateCategory() {
  const [loading, setLoading] = useState(false);

  const create = async (payload: CategoryPayload): Promise<CategoryItem | null> => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/categories
      // const response = await apiClient.post('/editor/categories', payload);
      // return response.data;

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newCategory: CategoryItem = {
        id: `cat-${Date.now()}`,
        ...payload,
        isActive: true,
        manuscriptCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Catégorie créée (mock):', newCategory);
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}

export function useUpdateCategory() {
  const [loading, setLoading] = useState(false);

  const update = async (
    id: string,
    payload: Partial<CategoryPayload>
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/categories/:id
      // await apiClient.put(`/editor/categories/${id}`, payload);

      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Catégorie mise à jour (mock):', { id, payload });
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}

export function useDeleteCategory() {
  const [loading, setLoading] = useState(false);

  const deleteItem = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/categories/:id
      // await apiClient.delete(`/editor/categories/${id}`);

      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Catégorie supprimée (mock):', id);
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading };
}
