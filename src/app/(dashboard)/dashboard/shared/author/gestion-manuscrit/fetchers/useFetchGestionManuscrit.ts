import { useState } from 'react';
import { getAllManuscrits, type BaseManuscrit } from '@/lib/data/manuscrits-shared';
// import { apiClient } from '@/lib/api/client';
// import { useAlertStore } from '@/stores/alertStore';

// Interface pour les commentaires du mentor
export interface CommentaireMentor {
  id: string;
  auteur: string;
  texte: string;
  date: string;
  section: 'forme' | 'style' | 'methodologie' | 'general';
  type?: 'mentor' | 'evaluateur' | 'editeur' | 'peer-review';
}

// Define the gestion-manuscrit item interface - extends BaseManuscrit
export interface GestionManuscritItem extends BaseManuscrit {
  title: string; // alias for titre
  status: BaseManuscrit['statut']; // alias for statut  
  createdAt: string; // alias for dateCreation
  updatedAt: string; // alias for dateMiseAJour
  authorId: string; // alias for auteurId
  contenu?: string;
  commentairesMentor: {
    forme: CommentaireMentor[];
    style: CommentaireMentor[];
    methodologie: CommentaireMentor[];
    general: CommentaireMentor[];
  };
  // Add more fields based on your API response
}

// Helper function pour convertir BaseManuscrit vers GestionManuscritItem
function convertToGestionManuscritItem(manuscrit: BaseManuscrit): GestionManuscritItem {
  return {
    ...manuscrit,
    title: manuscrit.titre, // alias
    status: manuscrit.statut, // alias
    createdAt: manuscrit.dateCreation, // alias
    updatedAt: manuscrit.dateMiseAJour, // alias
    authorId: manuscrit.auteurId, // alias
    contenu: manuscrit.contenu,
    commentairesMentor: getCommentairesMentor(manuscrit.id)
  };
}

// Helper function pour obtenir les commentaires par manuscrit
function getCommentairesMentor(manuscritId: string) {
  const commentairesData: Record<string, any> = {
    'ms1': {
      forme: [
        {
          id: 'f1',
          auteur: 'Dr. Martin Dubois',
          texte: 'La structure narrative est bien organisée. La progression entre les chapitres est fluide.',
          date: '2024-01-16T14:20:00Z',
          section: 'forme',
          type: 'mentor'
        }
      ],
      style: [
        {
          id: 's1',
          auteur: 'Dr. Martin Dubois',
          texte: 'Le style poétique est approprié au sujet. Quelques métaphores pourraient être développées.',
          date: '2024-01-16T14:25:00Z',
          section: 'style',
          type: 'mentor'
        }
      ],
      methodologie: [
        {
          id: 'm1',
          auteur: 'Prof. Sophie Laurent',
          texte: 'L\'approche ethnographique est pertinente. Ajoutez plus de références aux sources orales.',
          date: '2024-01-17T09:20:00Z',
          section: 'methodologie',
          type: 'mentor'
        }
      ],
      general: []
    },
    'ms2': {
      forme: [
        {
          id: 'f2',
          auteur: 'Dr. Claire Moreau',
          texte: 'La structure en recueil fonctionne bien. Pensez à ajouter une introduction générale.',
          date: '2024-01-19T11:30:00Z',
          section: 'forme',
          type: 'mentor'
        }
      ],
      style: [
        {
          id: 's2',
          auteur: 'Dr. Claire Moreau',
          texte: 'Le style est adapté au public jeunesse. Développez davantage les descriptions.',
          date: '2024-01-19T11:35:00Z',
          section: 'style',
          type: 'mentor'
        }
      ],
      methodologie: [],
      general: []
    },
    'ms3': {
      forme: [
        {
          id: 'f3',
          auteur: 'Prof. Jean Durand',
          texte: 'Document parfaitement structuré. La chronologie est claire et bien articulée.',
          date: '2024-01-12T11:30:00Z',
          section: 'forme',
          type: 'mentor'
        }
      ],
      style: [
        {
          id: 's3',
          auteur: 'Prof. Jean Durand',
          texte: 'Style narratif captivant. Excellent équilibre entre témoignage personnel et analyse historique.',
          date: '2024-01-12T11:35:00Z',
          section: 'style',
          type: 'mentor'
        }
      ],
      methodologie: [
        {
          id: 'm3',
          auteur: 'Prof. Jean Durand',
          texte: 'Méthodologie historiographique solide. Sources primaires bien exploitées.',
          date: '2024-01-12T11:40:00Z',
          section: 'methodologie',
          type: 'mentor'
        }
      ],
      general: [
        {
          id: 'g3',
          auteur: 'Prof. Marie Dubois',
          texte: 'Excellent travail ! Ce manuscrit est prêt pour publication.',
          date: '2024-01-12T15:30:00Z',
          section: 'general',
          type: 'mentor'
        }
      ]
    },
    'ms4': {
      forme: [
        {
          id: 'f4',
          auteur: 'Dr. Anne Rousseau',
          texte: 'Structure romanesque bien maîtrisée. Les transitions entre les parties sont réussies.',
          date: '2024-01-21T10:00:00Z',
          section: 'forme',
          type: 'mentor'
        }
      ],
      style: [
        {
          id: 's4',
          auteur: 'Dr. Anne Rousseau',
          texte: 'Style fluide et engageant. Les dialogues sonnent juste et naturels.',
          date: '2024-01-21T10:05:00Z',
          section: 'style',
          type: 'mentor'
        }
      ],
      methodologie: [],
      general: []
    },
    'ms5': {
      forme: [
        {
          id: 'f5',
          auteur: 'Dr. Paul Martin',
          texte: 'Format nouvelle bien adapté au sujet. La construction en flashbacks fonctionne.',
          date: '2024-01-20T14:00:00Z',
          section: 'forme',
          type: 'mentor'
        }
      ],
      style: [
        {
          id: 's5',
          auteur: 'Dr. Paul Martin',
          texte: 'Style nostalgique très évocateur. Les descriptions sensorielles sont particulièrement réussies.',
          date: '2024-01-20T14:05:00Z',
          section: 'style',
          type: 'mentor'
        }
      ],
      methodologie: [],
      general: []
    },
    'ms6': {
      forme: [
        {
          id: 'f6',
          auteur: 'Prof. Michel Bernard',
          texte: 'Plan d\'essai cohérent mais nécessite plus de développement dans chaque section.',
          date: '2024-01-22T14:30:00Z',
          section: 'forme',
          type: 'mentor'
        }
      ],
      style: [],
      methodologie: [
        {
          id: 'm6',
          auteur: 'Prof. Michel Bernard',
          texte: 'Ajoutez une méthodologie claire et des références bibliographiques pour étayer vos arguments.',
          date: '2024-01-22T14:35:00Z',
          section: 'methodologie',
          type: 'mentor'
        }
      ],
      general: []
    }
  };
  
  return commentairesData[manuscritId] || {
    forme: [],
    style: [],
    methodologie: [],
    general: []
  };
}

// Mock data using centralized data
const MOCK_DATA: GestionManuscritItem[] = getAllManuscrits().map(convertToGestionManuscritItem);

/**
 * Custom hook to fetch gestion-manuscrit list
 */
export function useFetchGestionManuscrit() {
  const [data, setData] = useState<GestionManuscritItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  // const { showError } = useAlertStore();

  const fetch = async () => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below and remove the mock data when ready

      // const response = await apiClient.get('/api/v1/gestion-manuscrit');
      // setData(response.data);
      // return response.data;

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      setData(MOCK_DATA);
      return MOCK_DATA;

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de chargement',
      //   error.response?.data?.message || 'Impossible de charger les gestion-manuscrit'
      // );
      console.error('Error fetching gestion-manuscrit:', error);
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
 * Custom hook to fetch a single gestion-manuscrit by ID
 */
export function useFetchGestionManuscritById() {
  const [data, setData] = useState<GestionManuscritItem | null>(null);
  const [loading, setLoading] = useState(false);
  // const { showError } = useAlertStore();

  const fetch = async (id: string) => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below and remove the mock data when ready

      // const response = await apiClient.get(`/api/v1/gestion-manuscrit/${id}`);
      // setData(response.data);
      // return response.data;

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const mockItem = MOCK_DATA.find((item) => item.id === id) || MOCK_DATA[0];
      setData(mockItem);
      return mockItem;

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de chargement',
      //   error.response?.data?.message || 'Impossible de charger cet élément'
      // );
      console.error('Error fetching gestion-manuscrit by ID:', error);
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
