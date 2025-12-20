import { useState } from 'react';

export interface RoleAssignmentItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  laboratoryId: string;
  laboratoryName: string;
  isActive: boolean;
  assignedAt: string;
  assignedBy?: string;
  assignedByName?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data - Attributions de rôles
const MOCK_ROLE_ASSIGNMENTS: RoleAssignmentItem[] = [
  {
    id: '1',
    userId: 'user-20',
    userName: 'Prof. Jean Dupont',
    userEmail: 'jean.dupont@universite.fr',
    role: 'EVALUATOR',
    laboratoryId: 'lab-1',
    laboratoryName: 'Laboratoire de Recherche en IA',
    isActive: true,
    assignedAt: '2024-06-15T10:00:00Z',
    assignedBy: 'user-1',
    assignedByName: 'Dr. Hassan Bamba',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
  },
  {
    id: '2',
    userId: 'user-21',
    userName: 'Dr. Marie Leclerc',
    userEmail: 'marie.leclerc@institut.fr',
    role: 'EVALUATOR',
    laboratoryId: 'lab-2',
    laboratoryName: 'Laboratoire de Sciences Environnementales',
    isActive: true,
    assignedAt: '2024-07-20T14:30:00Z',
    assignedBy: 'user-1',
    assignedByName: 'Dr. Hassan Bamba',
    createdAt: '2024-07-20T14:30:00Z',
    updatedAt: '2024-07-20T14:30:00Z',
  },
  {
    id: '3',
    userId: 'user-25',
    userName: 'Prof. Aminata Touré',
    userEmail: 'aminata.toure@univ.sn',
    role: 'MENTOR',
    laboratoryId: 'lab-1',
    laboratoryName: 'Laboratoire de Recherche en IA',
    isActive: true,
    assignedAt: '2024-05-10T09:00:00Z',
    assignedBy: 'user-1',
    assignedByName: 'Dr. Hassan Bamba',
    createdAt: '2024-05-10T09:00:00Z',
    updatedAt: '2024-05-10T09:00:00Z',
  },
  {
    id: '4',
    userId: 'user-26',
    userName: 'Dr. Sylvie Morel',
    userEmail: 'sylvie.morel@research.org',
    role: 'EVALUATOR',
    laboratoryId: 'lab-3',
    laboratoryName: 'Laboratoire de Sociologie Appliquée',
    isActive: true,
    assignedAt: '2024-08-01T11:00:00Z',
    assignedBy: 'user-1',
    assignedByName: 'Dr. Hassan Bamba',
    createdAt: '2024-08-01T11:00:00Z',
    updatedAt: '2024-08-01T11:00:00Z',
  },
  {
    id: '5',
    userId: 'user-27',
    userName: 'Dr. Elisabeth Fontaine',
    userEmail: 'e.fontaine@medschool.fr',
    role: 'EVALUATOR',
    laboratoryId: 'lab-2',
    laboratoryName: 'Laboratoire de Sciences Environnementales',
    isActive: true,
    assignedAt: '2024-09-15T16:00:00Z',
    assignedBy: 'user-1',
    assignedByName: 'Dr. Hassan Bamba',
    createdAt: '2024-09-15T16:00:00Z',
    updatedAt: '2024-09-15T16:00:00Z',
  },
  {
    id: '6',
    userId: 'user-28',
    userName: 'Prof. Moussa Diarra',
    userEmail: 'moussa.diarra@univ.ml',
    role: 'MENTOR',
    laboratoryId: 'lab-4',
    laboratoryName: 'Laboratoire de Mathématiques et Modélisation',
    isActive: true,
    assignedAt: '2024-10-01T08:30:00Z',
    assignedBy: 'user-1',
    assignedByName: 'Dr. Hassan Bamba',
    createdAt: '2024-10-01T08:30:00Z',
    updatedAt: '2024-10-01T08:30:00Z',
  },
  {
    id: '7',
    userId: 'user-29',
    userName: 'Dr. Sophie Laurent',
    userEmail: 'sophie.laurent@cnrs.fr',
    role: 'EVALUATOR',
    laboratoryId: 'lab-1',
    laboratoryName: 'Laboratoire de Recherche en IA',
    isActive: false,
    assignedAt: '2024-03-10T10:00:00Z',
    assignedBy: 'user-1',
    assignedByName: 'Dr. Hassan Bamba',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-11-15T14:00:00Z',
  },
  {
    id: '8',
    userId: 'user-30',
    userName: 'Prof. Omar Cissé',
    userEmail: 'omar.cisse@uppa.sn',
    role: 'MENTOR',
    laboratoryId: 'lab-3',
    laboratoryName: 'Laboratoire de Sociologie Appliquée',
    isActive: true,
    assignedAt: '2024-11-20T13:00:00Z',
    assignedBy: 'user-1',
    assignedByName: 'Dr. Hassan Bamba',
    createdAt: '2024-11-20T13:00:00Z',
    updatedAt: '2024-11-20T13:00:00Z',
  },
  {
    id: '9',
    userId: 'user-31',
    userName: 'Dr. Ndeye Fatou Sall',
    userEmail: 'ndeye.sall@ucad.sn',
    role: 'AUTHOR',
    laboratoryId: 'lab-2',
    laboratoryName: 'Laboratoire de Sciences Environnementales',
    isActive: true,
    assignedAt: '2025-01-05T09:00:00Z',
    assignedBy: 'user-1',
    assignedByName: 'Dr. Hassan Bamba',
    createdAt: '2025-01-05T09:00:00Z',
    updatedAt: '2025-01-05T09:00:00Z',
  },
  {
    id: '10',
    userId: 'user-32',
    userName: 'Dr. Cheikh Ndiaye',
    userEmail: 'cheikh.ndiaye@esp.sn',
    role: 'AUTHOR',
    laboratoryId: 'lab-4',
    laboratoryName: 'Laboratoire de Mathématiques et Modélisation',
    isActive: true,
    assignedAt: '2025-01-10T11:30:00Z',
    assignedBy: 'user-1',
    assignedByName: 'Dr. Hassan Bamba',
    createdAt: '2025-01-10T11:30:00Z',
    updatedAt: '2025-01-10T11:30:00Z',
  },
  {
    id: '11',
    userId: 'user-33',
    userName: 'Prof. Adama Beye',
    userEmail: 'adama.beye@univ.sn',
    role: 'MENTOR',
    laboratoryId: 'lab-1',
    laboratoryName: 'Laboratoire de Recherche en IA',
    isActive: true,
    assignedAt: '2024-12-01T10:00:00Z',
    assignedBy: 'user-1',
    assignedByName: 'Dr. Hassan Bamba',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
  },
  {
    id: '12',
    userId: 'user-34',
    userName: 'Dr. Aïssatou Diop',
    userEmail: 'aissatou.diop@ugb.edu.sn',
    role: 'EVALUATOR',
    laboratoryId: 'lab-3',
    laboratoryName: 'Laboratoire de Sociologie Appliquée',
    isActive: true,
    assignedAt: '2024-11-05T15:00:00Z',
    assignedBy: 'user-1',
    assignedByName: 'Dr. Hassan Bamba',
    createdAt: '2024-11-05T15:00:00Z',
    updatedAt: '2024-11-05T15:00:00Z',
  },
];

export function useFetchRoleAssignments() {
  const [data, setData] = useState<RoleAssignmentItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/role-assignments
      // const response = await apiClient.get('/editor/role-assignments');
      // setData(response.data);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setData(MOCK_ROLE_ASSIGNMENTS);
      return MOCK_ROLE_ASSIGNMENTS;
    } catch (error) {
      console.error('Error fetching role assignments:', error);
      setData([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetch();

  return { data, loading, fetch, refresh };
}

export function useFetchRoleAssignmentById() {
  const [data, setData] = useState<RoleAssignmentItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async (id: string) => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/role-assignments/:id
      // const response = await apiClient.get(`/editor/role-assignments/${id}`);
      // setData(response.data);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const assignment = MOCK_ROLE_ASSIGNMENTS.find((a) => a.id === id) || null;
      setData(assignment);
      return assignment;
    } catch (error) {
      console.error('Error fetching role assignment:', error);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fetch };
}
