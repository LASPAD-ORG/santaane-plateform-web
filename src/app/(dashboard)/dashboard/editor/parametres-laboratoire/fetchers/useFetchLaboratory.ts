import { useState } from 'react';

export interface LaboratoryItem {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  manuscriptCount: number;
  editorCount: number;
  researcherCount: number;
  editors: EditorInfo[];
  createdAt: string;
  updatedAt: string;
}

interface EditorInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  assignedAt: string;
}

const MOCK_LABORATORY: LaboratoryItem = {
  id: 'lab-1',
  name: 'Laboratoire de Recherche en Intelligence Artificielle',
  description:
    'Centre de recherche spécialisé dans le machine learning, le deep learning et les applications de l\'IA pour le développement durable en Afrique.',
  isActive: true,
  manuscriptCount: 45,
  editorCount: 3,
  researcherCount: 28,
  editors: [
    {
      id: 'user-1',
      name: 'Dr. Hassan Bamba',
      email: 'hassan.bamba@santaane.org',
      role: 'CHIEF_EDITOR',
      isActive: true,
      assignedAt: '2023-01-15T10:00:00Z',
    },
    {
      id: 'user-2',
      name: 'Dr. Mariama Sy',
      email: 'mariama.sy@santaane.org',
      role: 'ASSOCIATE_EDITOR',
      isActive: true,
      assignedAt: '2023-03-20T14:30:00Z',
    },
    {
      id: 'user-3',
      name: 'Dr. Boubacar Diallo',
      email: 'boubacar.diallo@santaane.org',
      role: 'SECTION_EDITOR',
      isActive: true,
      assignedAt: '2023-06-10T09:00:00Z',
    },
  ],
  createdAt: '2023-01-15T10:00:00Z',
  updatedAt: '2025-01-20T15:00:00Z',
};

export function useFetchLaboratory() {
  const [data, setData] = useState<LaboratoryItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/laboratory
      // const response = await apiClient.get('/editor/laboratory');
      // setData(response.data);

      await new Promise((resolve) => setTimeout(resolve, 500));
      setData(MOCK_LABORATORY);
      return MOCK_LABORATORY;
    } catch (error) {
      console.error('Error fetching laboratory:', error);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fetch };
}
