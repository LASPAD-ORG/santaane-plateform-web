import { useState } from 'react';

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  parentName?: string;
  isActive: boolean;
  manuscriptCount: number;
  createdAt: string;
  updatedAt: string;
}

// Mock data - Catégories hiérarchiques
const MOCK_CATEGORIES: CategoryItem[] = [
  // Catégories principales
  {
    id: 'cat-1',
    name: 'Sciences Environnementales',
    description:
      'Recherches sur l\'environnement, le changement climatique, et la biodiversité',
    isActive: true,
    manuscriptCount: 12,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Intelligence Artificielle',
    description:
      'Machine learning, deep learning, traitement du langage naturel, vision par ordinateur',
    isActive: true,
    manuscriptCount: 18,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'cat-3',
    name: 'Sociologie',
    description: 'Études sociales, démographie, migrations, développement urbain',
    isActive: true,
    manuscriptCount: 8,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'cat-4',
    name: 'Mathématiques Appliquées',
    description:
      'Modélisation mathématique, statistiques, analyse numérique, optimisation',
    isActive: true,
    manuscriptCount: 6,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'cat-5',
    name: 'Énergies Renouvelables',
    description:
      'Solaire, éolien, hydraulique, biomasse, efficacité énergétique',
    isActive: true,
    manuscriptCount: 7,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'cat-6',
    name: 'Linguistique',
    description:
      'Langues africaines, sociolinguistique, linguistique computationnelle',
    isActive: true,
    manuscriptCount: 4,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },

  // Sous-catégories pour Sciences Environnementales
  {
    id: 'cat-1-1',
    name: 'Changement Climatique',
    description: 'Études sur le réchauffement climatique et ses impacts',
    parentId: 'cat-1',
    parentName: 'Sciences Environnementales',
    isActive: true,
    manuscriptCount: 5,
    createdAt: '2023-02-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'cat-1-2',
    name: 'Biodiversité Marine',
    description: 'Conservation et étude des écosystèmes marins',
    parentId: 'cat-1',
    parentName: 'Sciences Environnementales',
    isActive: true,
    manuscriptCount: 4,
    createdAt: '2023-02-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'cat-1-3',
    name: 'Gestion des Déchets',
    description: 'Recyclage, économie circulaire, gestion des déchets urbains',
    parentId: 'cat-1',
    parentName: 'Sciences Environnementales',
    isActive: true,
    manuscriptCount: 3,
    createdAt: '2023-02-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },

  // Sous-catégories pour Intelligence Artificielle
  {
    id: 'cat-2-1',
    name: 'Machine Learning',
    description: 'Algorithmes d\'apprentissage automatique supervisé et non supervisé',
    parentId: 'cat-2',
    parentName: 'Intelligence Artificielle',
    isActive: true,
    manuscriptCount: 8,
    createdAt: '2023-02-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'cat-2-2',
    name: 'Vision par Ordinateur',
    description: 'Traitement d\'images, reconnaissance de formes, détection d\'objets',
    parentId: 'cat-2',
    parentName: 'Intelligence Artificielle',
    isActive: true,
    manuscriptCount: 6,
    createdAt: '2023-02-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'cat-2-3',
    name: 'Traitement du Langage Naturel',
    description: 'NLP, chatbots, traduction automatique, analyse de sentiments',
    parentId: 'cat-2',
    parentName: 'Intelligence Artificielle',
    isActive: true,
    manuscriptCount: 4,
    createdAt: '2023-02-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },

  // Sous-catégories pour Sociologie
  {
    id: 'cat-3-1',
    name: 'Migrations Urbaines',
    description: 'Exode rural, urbanisation, intégration urbaine',
    parentId: 'cat-3',
    parentName: 'Sociologie',
    isActive: true,
    manuscriptCount: 5,
    createdAt: '2023-02-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'cat-3-2',
    name: 'Sociologie de l\'Éducation',
    description: 'Systèmes éducatifs, inégalités scolaires, alphabétisation',
    parentId: 'cat-3',
    parentName: 'Sociologie',
    isActive: true,
    manuscriptCount: 3,
    createdAt: '2023-02-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
];

export function useFetchCategories() {
  const [data, setData] = useState<CategoryItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/categories
      // const response = await apiClient.get('/editor/categories');
      // setData(response.data);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setData(MOCK_CATEGORIES);
      return MOCK_CATEGORIES;
    } catch (error) {
      console.error('Error fetching categories:', error);
      setData([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetch();

  return { data, loading, fetch, refresh };
}

export function useFetchCategoryById() {
  const [data, setData] = useState<CategoryItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async (id: string) => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/categories/:id
      // const response = await apiClient.get(`/editor/categories/${id}`);
      // setData(response.data);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const category = MOCK_CATEGORIES.find((c) => c.id === id) || null;
      setData(category);
      return category;
    } catch (error) {
      console.error('Error fetching category:', error);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fetch };
}
