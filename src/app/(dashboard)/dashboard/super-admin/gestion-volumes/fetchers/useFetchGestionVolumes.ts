import { useState } from 'react';

// Volume types and interfaces
export type VolumeStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type IssueStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Issue {
  id: string;
  title: string;
  volumeId: string;
  publicationDate: string;
  status: IssueStatus;
  isOpenAccess: boolean;
  coverImage?: string;
  description?: string;
}

export interface Volume {
  id: string;
  title: string;
  year: number;
  status: VolumeStatus;
  description?: string;
  issues: Issue[];
}

// Mock data for testing - Remove this when connecting to real API
export const mockVolumes: Volume[] = [
  {
    id: '1',
    title: 'Volume 1',
    year: 2023,
    status: 'PUBLISHED',
    description: 'Premier volume de la revue.',
    issues: [
      {
        id: '1-1',
        title: 'Numéro 1',
        volumeId: '1',
        publicationDate: '2023-01-15',
        status: 'PUBLISHED',
        isOpenAccess: true,
        description: 'Numéro inaugural.',
      },
      {
        id: '1-2',
        title: 'Numéro 2',
        volumeId: '1',
        publicationDate: '2023-06-20',
        status: 'PUBLISHED',
        isOpenAccess: false,
        description: 'Dossier spécial sur l\'IA.',
      },
    ],
  },
  {
    id: '2',
    title: 'Volume 2',
    year: 2024,
    status: 'DRAFT',
    description: 'Volume en cours de préparation.',
    issues: [
      {
        id: '2-1',
        title: 'Numéro 1',
        volumeId: '2',
        publicationDate: '2024-02-01',
        status: 'DRAFT',
        isOpenAccess: true,
      },
    ],
  },
];

/**
 * Custom hook to fetch volumes list
 */
export function useFetchGestionVolumes() {
  const [data, setData] = useState<Volume[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setData(mockVolumes);
      return mockVolumes;
    } catch (error: any) {
      console.error('Error fetching volumes:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    fetch,
    refresh: fetch,
  };
}

/**
 * Custom hook to fetch a single volume by ID
 */
export function useFetchGestionVolumesById() {
  const [data, setData] = useState<Volume | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async (id: string) => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockItem = mockVolumes.find((item) => item.id === id);
      if (mockItem) {
        setData(mockItem);
        return mockItem;
      }
      throw new Error('Volume not found');
    } catch (error: any) {
      console.error('Error fetching volume by ID:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    fetch,
  };
}

