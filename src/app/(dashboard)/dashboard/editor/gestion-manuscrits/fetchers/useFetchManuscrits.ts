import { useState } from 'react';

export interface ManuscritItem {
  id: string;
  title: string;
  abstract?: string;
  keywords?: string;
  authorId: string;
  authorName: string;
  categoryId?: string;
  categoryName?: string;
  status: string;
  submittedAt?: string;
  lastRevisionAt?: string;
  decisionAt?: string;
  publishedAt?: string;
  version: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  reviewAssignments?: ReviewAssignment[];
  mentorships?: Mentorship[];
  decisions?: ReviewDecision[];
}

export interface ReviewAssignment {
  id: string;
  manuscriptId: string;
  reviewerId: string;
  reviewerName: string;
  status: string;
  recommendation?: string;
  dueDate?: string;
  acceptedAt?: string;
  completedAt?: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface Mentorship {
  id: string;
  manuscriptId: string;
  mentorId: string;
  mentorName: string;
  status: string;
  startedAt: string;
  completedAt?: string;
}

export interface ReviewDecision {
  id: string;
  manuscriptId: string;
  decidedBy: string;
  editorName: string;
  decision: string;
  decisionLetter?: string;
  internalNotes?: string;
  decidedAt: string;
}

// Mock data - Manuscrits du laboratoire de l'éditeur
const MOCK_MANUSCRITS: ManuscritItem[] = [
  {
    id: '1',
    title: 'Impact du changement climatique sur la biodiversité marine',
    abstract:
      'Cette étude examine les effets du réchauffement climatique sur les écosystèmes marins côtiers. Nos résultats montrent une diminution significative de 30% de la diversité des espèces dans les zones étudiées.',
    keywords: 'changement climatique, biodiversité, océans, écosystèmes',
    authorId: 'user-5',
    authorName: 'Dr. Sophie Martin',
    categoryId: 'cat-1',
    categoryName: 'Sciences Environnementales',
    status: 'UNDER_REVIEW',
    submittedAt: '2025-01-10T10:00:00Z',
    version: 1,
    isArchived: false,
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-15T14:30:00Z',
    reviewAssignments: [
      {
        id: 'rev-1',
        manuscriptId: '1',
        reviewerId: 'user-20',
        reviewerName: 'Prof. Jean Dupont',
        status: 'COMPLETED',
        recommendation: 'MINOR_REVISION',
        dueDate: '2025-02-10T23:59:59Z',
        completedAt: '2025-01-20T16:45:00Z',
        isAnonymous: true,
        createdAt: '2025-01-12T09:00:00Z',
      },
      {
        id: 'rev-2',
        manuscriptId: '1',
        reviewerId: 'user-21',
        reviewerName: 'Dr. Marie Leclerc',
        status: 'COMPLETED',
        recommendation: 'ACCEPT',
        dueDate: '2025-02-10T23:59:59Z',
        completedAt: '2025-01-21T11:20:00Z',
        isAnonymous: true,
        createdAt: '2025-01-12T09:00:00Z',
      },
    ],
  },
  {
    id: '2',
    title: 'Développement d\'un algorithme d\'apprentissage profond pour la détection de maladies',
    abstract:
      'Nous proposons un nouveau modèle de réseau neuronal convolutif capable de détecter avec une précision de 95% plusieurs pathologies à partir d\'images médicales.',
    keywords: 'intelligence artificielle, médecine, deep learning, diagnostic',
    authorId: 'user-6',
    authorName: 'Dr. Ahmed El Mansouri',
    categoryId: 'cat-2',
    categoryName: 'Intelligence Artificielle',
    status: 'SUBMITTED',
    submittedAt: '2025-01-18T14:30:00Z',
    version: 1,
    isArchived: false,
    createdAt: '2025-01-18T14:30:00Z',
    updatedAt: '2025-01-18T14:30:00Z',
    reviewAssignments: [],
  },
  {
    id: '3',
    title: 'Analyse socio-économique des migrations urbaines en Afrique de l\'Ouest',
    abstract:
      'Cette recherche examine les facteurs déterminants des flux migratoires vers les grandes villes d\'Afrique de l\'Ouest et leurs conséquences sur le développement urbain.',
    keywords: 'migration, urbanisation, Afrique, développement',
    authorId: 'user-7',
    authorName: 'Dr. Fatou Diallo',
    categoryId: 'cat-3',
    categoryName: 'Sociologie',
    status: 'REVISION_REQUESTED',
    submittedAt: '2024-12-05T09:00:00Z',
    lastRevisionAt: '2025-01-10T16:00:00Z',
    decisionAt: '2025-01-08T10:30:00Z',
    version: 2,
    isArchived: false,
    createdAt: '2024-12-05T09:00:00Z',
    updatedAt: '2025-01-10T16:00:00Z',
    reviewAssignments: [
      {
        id: 'rev-3',
        manuscriptId: '3',
        reviewerId: 'user-22',
        reviewerName: 'Prof. Pierre Dubois',
        status: 'COMPLETED',
        recommendation: 'MAJOR_REVISION',
        completedAt: '2024-12-20T14:00:00Z',
        isAnonymous: true,
        createdAt: '2024-12-07T10:00:00Z',
      },
    ],
    decisions: [
      {
        id: 'dec-1',
        manuscriptId: '3',
        decidedBy: 'user-1',
        editorName: 'Dr. Hassan Bamba',
        decision: 'MAJOR_REVISION',
        decisionLetter:
          'Après examen des rapports d\'évaluation, nous vous demandons d\'apporter des révisions majeures...',
        decidedAt: '2025-01-08T10:30:00Z',
      },
    ],
    mentorships: [
      {
        id: 'men-1',
        manuscriptId: '3',
        mentorId: 'user-25',
        mentorName: 'Prof. Aminata Touré',
        status: 'ACTIVE',
        startedAt: '2024-12-10T08:00:00Z',
      },
    ],
  },
  {
    id: '4',
    title: 'Modélisation mathématique de la propagation des épidémies',
    abstract:
      'Nous développons un modèle SEIR étendu pour prédire la propagation des maladies infectieuses en tenant compte des mesures sanitaires et de la vaccination.',
    authorId: 'user-8',
    authorName: 'Dr. Ibrahim Sow',
    categoryId: 'cat-4',
    categoryName: 'Mathématiques Appliquées',
    status: 'UNDER_REVIEW',
    submittedAt: '2025-01-12T11:20:00Z',
    version: 1,
    isArchived: false,
    createdAt: '2025-01-12T11:20:00Z',
    updatedAt: '2025-01-12T11:20:00Z',
    reviewAssignments: [
      {
        id: 'rev-4',
        manuscriptId: '4',
        reviewerId: 'user-23',
        reviewerName: 'Dr. Claire Bernard',
        status: 'IN_PROGRESS',
        dueDate: '2025-02-12T23:59:59Z',
        acceptedAt: '2025-01-13T09:00:00Z',
        isAnonymous: true,
        createdAt: '2025-01-12T15:00:00Z',
      },
    ],
  },
  {
    id: '5',
    title: 'Énergie solaire et développement durable au Sahel',
    abstract:
      'Étude de la viabilité économique et technique du déploiement de panneaux solaires dans les zones rurales du Sahel.',
    keywords: 'énergie renouvelable, solaire, Sahel, développement durable',
    authorId: 'user-9',
    authorName: 'Dr. Mariam Konaté',
    categoryId: 'cat-5',
    categoryName: 'Énergies Renouvelables',
    status: 'ACCEPTED',
    submittedAt: '2024-11-20T10:00:00Z',
    decisionAt: '2025-01-05T14:00:00Z',
    version: 2,
    isArchived: false,
    createdAt: '2024-11-20T10:00:00Z',
    updatedAt: '2025-01-06T09:00:00Z',
    reviewAssignments: [
      {
        id: 'rev-5',
        manuscriptId: '5',
        reviewerId: 'user-24',
        reviewerName: 'Prof. Laurent Mercier',
        status: 'COMPLETED',
        recommendation: 'ACCEPT',
        completedAt: '2024-12-15T16:00:00Z',
        isAnonymous: true,
        createdAt: '2024-11-22T10:00:00Z',
      },
      {
        id: 'rev-6',
        manuscriptId: '5',
        reviewerId: 'user-25',
        reviewerName: 'Prof. Aminata Touré',
        status: 'COMPLETED',
        recommendation: 'MINOR_REVISION',
        completedAt: '2024-12-18T10:30:00Z',
        isAnonymous: true,
        createdAt: '2024-11-22T10:00:00Z',
      },
    ],
    decisions: [
      {
        id: 'dec-2',
        manuscriptId: '5',
        decidedBy: 'user-1',
        editorName: 'Dr. Hassan Bamba',
        decision: 'ACCEPT',
        decisionLetter:
          'Félicitations ! Votre manuscrit est accepté pour publication...',
        decidedAt: '2025-01-05T14:00:00Z',
      },
    ],
  },
  {
    id: '6',
    title: 'Préservation des langues africaines à l\'ère numérique',
    authorId: 'user-10',
    authorName: 'Dr. Ousmane Traoré',
    categoryId: 'cat-6',
    categoryName: 'Linguistique',
    status: 'REJECTED',
    submittedAt: '2024-10-15T09:00:00Z',
    decisionAt: '2024-12-20T11:00:00Z',
    version: 1,
    isArchived: false,
    createdAt: '2024-10-15T09:00:00Z',
    updatedAt: '2024-12-20T11:00:00Z',
    reviewAssignments: [
      {
        id: 'rev-7',
        manuscriptId: '6',
        reviewerId: 'user-26',
        reviewerName: 'Dr. Sylvie Morel',
        status: 'COMPLETED',
        recommendation: 'REJECT',
        completedAt: '2024-11-10T15:00:00Z',
        isAnonymous: true,
        createdAt: '2024-10-17T10:00:00Z',
      },
    ],
    decisions: [
      {
        id: 'dec-3',
        manuscriptId: '6',
        decidedBy: 'user-1',
        editorName: 'Dr. Hassan Bamba',
        decision: 'REJECT',
        decisionLetter:
          'Après examen attentif, nous regrettons de ne pas pouvoir accepter votre manuscrit...',
        decidedAt: '2024-12-20T11:00:00Z',
      },
    ],
  },
  {
    id: '7',
    title: 'Blockchain et traçabilité des produits agricoles',
    abstract:
      'Application de la technologie blockchain pour garantir la traçabilité et l\'authenticité des produits agricoles biologiques.',
    authorId: 'user-11',
    authorName: 'Dr. Khadija Ndiaye',
    status: 'SUBMITTED',
    submittedAt: '2025-01-20T08:30:00Z',
    version: 1,
    isArchived: false,
    createdAt: '2025-01-20T08:30:00Z',
    updatedAt: '2025-01-20T08:30:00Z',
  },
  {
    id: '8',
    title: 'Pratiques traditionnelles et médecine moderne en Afrique',
    abstract:
      'Exploration de la coexistence et de la complémentarité entre médecine traditionnelle et médecine moderne dans les systèmes de santé africains.',
    authorId: 'user-12',
    authorName: 'Dr. Amadou Ba',
    status: 'UNDER_REVIEW',
    submittedAt: '2025-01-14T13:00:00Z',
    version: 1,
    isArchived: false,
    createdAt: '2025-01-14T13:00:00Z',
    updatedAt: '2025-01-14T13:00:00Z',
    reviewAssignments: [
      {
        id: 'rev-8',
        manuscriptId: '8',
        reviewerId: 'user-27',
        reviewerName: 'Dr. Elisabeth Fontaine',
        status: 'PENDING',
        dueDate: '2025-02-14T23:59:59Z',
        isAnonymous: true,
        createdAt: '2025-01-15T10:00:00Z',
      },
    ],
  },
];

export function useFetchManuscrits() {
  const [data, setData] = useState<ManuscritItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/manuscripts
      // const response = await apiClient.get('/editor/manuscripts');
      // setData(response.data);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setData(MOCK_MANUSCRITS);
      return MOCK_MANUSCRITS;
    } catch (error) {
      console.error('Error fetching manuscrits:', error);
      setData([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetch();

  return { data, loading, fetch, refresh };
}

export function useFetchManuscritById() {
  const [data, setData] = useState<ManuscritItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async (id: string) => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/manuscripts/:id
      // const response = await apiClient.get(`/editor/manuscripts/${id}`);
      // setData(response.data);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const manuscrit = MOCK_MANUSCRITS.find((m) => m.id === id) || null;
      setData(manuscrit);
      return manuscrit;
    } catch (error) {
      console.error('Error fetching manuscrit:', error);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fetch };
}
