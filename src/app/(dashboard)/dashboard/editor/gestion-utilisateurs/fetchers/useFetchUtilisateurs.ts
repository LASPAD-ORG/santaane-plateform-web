import { useState } from 'react';

export interface UtilisateurItem {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  roles: string[];
  laboratoryId: string;
  laboratoryName: string;
  countryId?: string;
  countryName?: string;
  cityId?: string;
  cityName?: string;
  timezone?: string;
  orcidId?: string;
  manuscriptCount: number;
  reviewCount: number;
  mentorshipCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data - Chercheurs du laboratoire
const MOCK_UTILISATEURS: UtilisateurItem[] = [
  {
    id: 'user-5',
    fullName: 'Dr. Sophie Martin',
    email: 'sophie.martin@univ.fr',
    emailVerified: true,
    roles: ['AUTHOR'],
    laboratoryId: 'lab-2',
    laboratoryName: 'Laboratoire de Sciences Environnementales',
    countryId: 'FR',
    countryName: 'France',
    cityName: 'Paris',
    orcidId: '0000-0001-2345-6789',
    manuscriptCount: 3,
    reviewCount: 0,
    mentorshipCount: 0,
    isActive: true,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'user-6',
    fullName: 'Dr. Ahmed El Mansouri',
    email: 'ahmed.elmansouri@research.ma',
    emailVerified: true,
    roles: ['AUTHOR', 'EVALUATOR'],
    laboratoryId: 'lab-1',
    laboratoryName: 'Laboratoire de Recherche en IA',
    countryId: 'MA',
    countryName: 'Maroc',
    cityName: 'Rabat',
    orcidId: '0000-0002-3456-7890',
    manuscriptCount: 2,
    reviewCount: 5,
    mentorshipCount: 0,
    isActive: true,
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2025-01-18T14:30:00Z',
  },
  {
    id: 'user-7',
    fullName: 'Dr. Fatou Diallo',
    email: 'fatou.diallo@univ.sn',
    emailVerified: true,
    roles: ['AUTHOR', 'MENTOR'],
    laboratoryId: 'lab-3',
    laboratoryName: 'Laboratoire de Sociologie Appliquée',
    countryId: 'SN',
    countryName: 'Sénégal',
    cityName: 'Dakar',
    orcidId: '0000-0003-4567-8901',
    manuscriptCount: 4,
    reviewCount: 0,
    mentorshipCount: 2,
    isActive: true,
    createdAt: '2023-11-10T09:00:00Z',
    updatedAt: '2025-01-10T16:00:00Z',
  },
  {
    id: 'user-8',
    fullName: 'Dr. Ibrahim Sow',
    email: 'ibrahim.sow@ugb.sn',
    emailVerified: true,
    roles: ['AUTHOR'],
    laboratoryId: 'lab-4',
    laboratoryName: 'Laboratoire de Mathématiques et Modélisation',
    countryId: 'SN',
    countryName: 'Sénégal',
    cityName: 'Saint-Louis',
    manuscriptCount: 1,
    reviewCount: 0,
    mentorshipCount: 0,
    isActive: true,
    createdAt: '2024-12-01T11:00:00Z',
    updatedAt: '2025-01-12T11:20:00Z',
  },
  {
    id: 'user-9',
    fullName: 'Dr. Mariam Konaté',
    email: 'mariam.konate@univ.ml',
    emailVerified: true,
    roles: ['AUTHOR'],
    laboratoryId: 'lab-2',
    laboratoryName: 'Laboratoire de Sciences Environnementales',
    countryId: 'ML',
    countryName: 'Mali',
    cityName: 'Bamako',
    orcidId: '0000-0004-5678-9012',
    manuscriptCount: 2,
    reviewCount: 0,
    mentorshipCount: 0,
    isActive: true,
    createdAt: '2023-09-05T10:00:00Z',
    updatedAt: '2025-01-06T09:00:00Z',
  },
  {
    id: 'user-10',
    fullName: 'Dr. Ousmane Traoré',
    email: 'ousmane.traore@ucad.sn',
    emailVerified: true,
    roles: ['AUTHOR'],
    laboratoryId: 'lab-3',
    laboratoryName: 'Laboratoire de Sociologie Appliquée',
    countryId: 'SN',
    countryName: 'Sénégal',
    cityName: 'Dakar',
    manuscriptCount: 1,
    reviewCount: 0,
    mentorshipCount: 0,
    isActive: true,
    createdAt: '2024-08-20T09:00:00Z',
    updatedAt: '2024-12-20T11:00:00Z',
  },
  {
    id: 'user-11',
    fullName: 'Dr. Khadija Ndiaye',
    email: 'khadija.ndiaye@esp.sn',
    emailVerified: true,
    roles: ['AUTHOR', 'EVALUATOR'],
    laboratoryId: 'lab-1',
    laboratoryName: 'Laboratoire de Recherche en IA',
    countryId: 'SN',
    countryName: 'Sénégal',
    cityName: 'Dakar',
    orcidId: '0000-0005-6789-0123',
    manuscriptCount: 1,
    reviewCount: 3,
    mentorshipCount: 0,
    isActive: true,
    createdAt: '2025-01-05T08:00:00Z',
    updatedAt: '2025-01-20T08:30:00Z',
  },
  {
    id: 'user-12',
    fullName: 'Dr. Amadou Ba',
    email: 'amadou.ba@univ.sn',
    emailVerified: true,
    roles: ['AUTHOR'],
    laboratoryId: 'lab-2',
    laboratoryName: 'Laboratoire de Sciences Environnementales',
    countryId: 'SN',
    countryName: 'Sénégal',
    cityName: 'Thiès',
    manuscriptCount: 1,
    reviewCount: 0,
    mentorshipCount: 0,
    isActive: true,
    createdAt: '2024-12-20T13:00:00Z',
    updatedAt: '2025-01-14T13:00:00Z',
  },
  {
    id: 'user-20',
    fullName: 'Prof. Jean Dupont',
    email: 'jean.dupont@universite.fr',
    emailVerified: true,
    roles: ['EVALUATOR', 'MENTOR'],
    laboratoryId: 'lab-1',
    laboratoryName: 'Laboratoire de Recherche en IA',
    countryId: 'FR',
    countryName: 'France',
    cityName: 'Lyon',
    orcidId: '0000-0010-1234-5678',
    manuscriptCount: 0,
    reviewCount: 12,
    mentorshipCount: 3,
    isActive: true,
    createdAt: '2023-05-10T10:00:00Z',
    updatedAt: '2025-01-20T16:45:00Z',
  },
  {
    id: 'user-21',
    fullName: 'Dr. Marie Leclerc',
    email: 'marie.leclerc@institut.fr',
    emailVerified: true,
    roles: ['EVALUATOR'],
    laboratoryId: 'lab-2',
    laboratoryName: 'Laboratoire de Sciences Environnementales',
    countryId: 'FR',
    countryName: 'France',
    cityName: 'Marseille',
    orcidId: '0000-0011-2345-6789',
    manuscriptCount: 0,
    reviewCount: 8,
    mentorshipCount: 0,
    isActive: true,
    createdAt: '2023-07-01T14:00:00Z',
    updatedAt: '2025-01-21T11:20:00Z',
  },
  {
    id: 'user-25',
    fullName: 'Prof. Aminata Touré',
    email: 'aminata.toure@univ.sn',
    emailVerified: true,
    roles: ['MENTOR', 'EVALUATOR'],
    laboratoryId: 'lab-1',
    laboratoryName: 'Laboratoire de Recherche en IA',
    countryId: 'SN',
    countryName: 'Sénégal',
    cityName: 'Dakar',
    orcidId: '0000-0015-5678-9012',
    manuscriptCount: 0,
    reviewCount: 6,
    mentorshipCount: 5,
    isActive: true,
    createdAt: '2023-04-15T09:00:00Z',
    updatedAt: '2025-01-18T10:30:00Z',
  },
  {
    id: 'user-26',
    fullName: 'Dr. Sylvie Morel',
    email: 'sylvie.morel@research.org',
    emailVerified: true,
    roles: ['EVALUATOR'],
    laboratoryId: 'lab-3',
    laboratoryName: 'Laboratoire de Sociologie Appliquée',
    countryId: 'FR',
    countryName: 'France',
    cityName: 'Toulouse',
    manuscriptCount: 0,
    reviewCount: 4,
    mentorshipCount: 0,
    isActive: true,
    createdAt: '2024-02-20T11:00:00Z',
    updatedAt: '2024-11-10T15:00:00Z',
  },
  {
    id: 'user-27',
    fullName: 'Dr. Elisabeth Fontaine',
    email: 'e.fontaine@medschool.fr',
    emailVerified: true,
    roles: ['EVALUATOR'],
    laboratoryId: 'lab-2',
    laboratoryName: 'Laboratoire de Sciences Environnementales',
    countryId: 'FR',
    countryName: 'France',
    cityName: 'Bordeaux',
    manuscriptCount: 0,
    reviewCount: 2,
    mentorshipCount: 0,
    isActive: true,
    createdAt: '2024-08-10T16:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'user-28',
    fullName: 'Prof. Moussa Diarra',
    email: 'moussa.diarra@univ.ml',
    emailVerified: true,
    roles: ['MENTOR', 'AUTHOR'],
    laboratoryId: 'lab-4',
    laboratoryName: 'Laboratoire de Mathématiques et Modélisation',
    countryId: 'ML',
    countryName: 'Mali',
    cityName: 'Bamako',
    orcidId: '0000-0018-9012-3456',
    manuscriptCount: 2,
    reviewCount: 0,
    mentorshipCount: 4,
    isActive: true,
    createdAt: '2023-06-01T08:00:00Z',
    updatedAt: '2025-01-01T08:30:00Z',
  },
  {
    id: 'user-30',
    fullName: 'Prof. Omar Cissé',
    email: 'omar.cisse@uppa.sn',
    emailVerified: true,
    roles: ['MENTOR'],
    laboratoryId: 'lab-3',
    laboratoryName: 'Laboratoire de Sociologie Appliquée',
    countryId: 'SN',
    countryName: 'Sénégal',
    cityName: 'Ziguinchor',
    manuscriptCount: 0,
    reviewCount: 0,
    mentorshipCount: 3,
    isActive: true,
    createdAt: '2024-10-10T13:00:00Z',
    updatedAt: '2024-11-20T13:00:00Z',
  },
  {
    id: 'user-31',
    fullName: 'Dr. Ndeye Fatou Sall',
    email: 'ndeye.sall@ucad.sn',
    emailVerified: false,
    roles: ['AUTHOR'],
    laboratoryId: 'lab-2',
    laboratoryName: 'Laboratoire de Sciences Environnementales',
    countryId: 'SN',
    countryName: 'Sénégal',
    manuscriptCount: 0,
    reviewCount: 0,
    mentorshipCount: 0,
    isActive: true,
    createdAt: '2025-01-05T09:00:00Z',
    updatedAt: '2025-01-05T09:00:00Z',
  },
  {
    id: 'user-32',
    fullName: 'Dr. Cheikh Ndiaye',
    email: 'cheikh.ndiaye@esp.sn',
    emailVerified: true,
    roles: ['AUTHOR'],
    laboratoryId: 'lab-4',
    laboratoryName: 'Laboratoire de Mathématiques et Modélisation',
    countryId: 'SN',
    countryName: 'Sénégal',
    manuscriptCount: 0,
    reviewCount: 0,
    mentorshipCount: 0,
    isActive: true,
    createdAt: '2025-01-10T11:30:00Z',
    updatedAt: '2025-01-10T11:30:00Z',
  },
];

export function useFetchUtilisateurs() {
  const [data, setData] = useState<UtilisateurItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/researchers
      // const response = await apiClient.get('/editor/researchers');
      // setData(response.data);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setData(MOCK_UTILISATEURS);
      return MOCK_UTILISATEURS;
    } catch (error) {
      console.error('Error fetching utilisateurs:', error);
      setData([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetch();

  return { data, loading, fetch, refresh };
}

export function useFetchUtilisateurById() {
  const [data, setData] = useState<UtilisateurItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async (id: string) => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/researchers/:id
      // const response = await apiClient.get(`/editor/researchers/${id}`);
      // setData(response.data);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const utilisateur = MOCK_UTILISATEURS.find((c) => c.id === id) || null;
      setData(utilisateur);
      return utilisateur;
    } catch (error) {
      console.error('Error fetching utilisateur:', error);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fetch };
}
