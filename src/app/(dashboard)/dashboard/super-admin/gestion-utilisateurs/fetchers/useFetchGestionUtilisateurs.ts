import { useState } from 'react';
import { User, UserStatus } from '../types';
import { UserRole } from '@/types/auth';
// import { apiClient } from '@/lib/api/client';
// import { useAlertStore } from '@/stores/alertStore';

// Type alias for backward compatibility
export type GestionUtilisateursItem = User;

// Mock data for testing - Remove this when connecting to real API
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@santaane.com',
    prenom: 'Admin',
    nom: 'Principal',
    roles: [UserRole.SUPER_ADMIN],
    status: UserStatus.ACTIVE,
    laboratoire: 'lab1',
    specialite: 'informatique',
    telephone: '+221 77 123 45 67',
    dateCreation: '2024-01-15T08:00:00Z',
    derniereConnexion: '2024-01-20T14:30:00Z',
    emailVerifie: true,
    isActive: true,
  },
  {
    id: '2',
    email: 'editeur@santaane.com',
    prenom: 'Marie',
    nom: 'Dupont',
    roles: [UserRole.EDITOR],
    status: UserStatus.ACTIVE,
    laboratoire: 'lab2',
    specialite: 'biologie',
    telephone: '+221 76 234 56 78',
    dateCreation: '2024-01-10T10:00:00Z',
    derniereConnexion: '2024-01-19T16:45:00Z',
    emailVerifie: true,
    isActive: true,
  },
  {
    id: '3',
    email: 'evaluateur@santaane.com',
    prenom: 'Dr. Ahmed',
    nom: 'Sy',
    roles: [UserRole.EVALUATOR],
    status: UserStatus.ACTIVE,
    laboratoire: 'lab3',
    specialite: 'chimie',
    telephone: '+221 77 345 67 89',
    dateCreation: '2024-01-12T12:00:00Z',
    derniereConnexion: '2024-01-18T09:15:00Z',
    emailVerifie: true,
    isActive: true,
  },
  {
    id: '4',
    email: 'mentor@santaane.com',
    prenom: 'Fatou',
    nom: 'Diallo',
    roles: [UserRole.MENTOR],
    status: UserStatus.ACTIVE,
    laboratoire: 'lab1',
    specialite: 'physique',
    telephone: '+221 78 456 78 90',
    dateCreation: '2024-01-08T14:00:00Z',
    derniereConnexion: '2024-01-17T11:30:00Z',
    emailVerifie: true,
    isActive: true,
  },
  {
    id: '5',
    email: 'auteur1@santaane.com',
    prenom: 'Ousmane',
    nom: 'Ba',
    roles: [UserRole.AUTHOR],
    status: UserStatus.PENDING,
    laboratoire: 'lab2',
    specialite: 'mathematiques',
    dateCreation: '2024-01-18T16:00:00Z',
    emailVerifie: false,
    isActive: true,
  },
  {
    id: '6',
    email: 'auteur2@santaane.com',
    prenom: 'Aissatou',
    nom: 'Fall',
    roles: [UserRole.AUTHOR],
    status: UserStatus.SUSPENDED,
    laboratoire: 'lab4',
    specialite: 'biologie',
    telephone: '+221 76 567 89 01',
    dateCreation: '2024-01-05T09:00:00Z',
    derniereConnexion: '2024-01-10T13:20:00Z',
    emailVerifie: true,
    isActive: false,
  },
];


/**
 * Custom hook to fetch gestion-utilisateurs list
 */
export function useFetchGestionUtilisateurs() {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  // const { showError } = useAlertStore();

  const fetch = async () => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below and remove the mock data when ready

      // const response = await apiClient.get('/api/v1/gestion-utilisateurs');
      // setData(response.data);
      // return response.data;

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      setData(mockUsers);
      return mockUsers;

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de chargement',
      //   error.response?.data?.message || 'Impossible de charger les gestion-utilisateurs'
      // );
      console.error('Error fetching gestion-utilisateurs:', error);
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
 * Custom hook to fetch a single gestion-utilisateurs by ID
 */
export function useFetchGestionUtilisateursById() {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  // const { showError } = useAlertStore();

  const fetch = async (id: string) => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below and remove the mock data when ready

      // const response = await apiClient.get(`/api/v1/gestion-utilisateurs/${id}`);
      // setData(response.data);
      // return response.data;

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const mockItem = mockUsers.find((item) => item.id === id) || mockUsers[0];
      setData(mockItem);
      return mockItem;

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de chargement',
      //   error.response?.data?.message || 'Impossible de charger cet élément'
      // );
      console.error('Error fetching gestion-utilisateurs by ID:', error);
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
