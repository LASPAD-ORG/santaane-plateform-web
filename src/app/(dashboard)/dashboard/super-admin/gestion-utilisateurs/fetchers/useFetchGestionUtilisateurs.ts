import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';
import { UserRole } from '@/types/auth';

/**
 * Backend API User structure
 * Matches the response from GET /api/v1/users
 */
export interface BackendUser {
  id: string;
  email: string;
  full_name?: string;
  fullName?: string;
  roles: Array<{
    id: number;
    name: string;
    description: string;
  }>;
  isActive: boolean;
  emailVerified: boolean;
  created_at: string;
  updated_at: string;
  country_id?: number | null;
  city_id?: number | null;
  timezone?: string | null;
  profile_photo?: string | null;
  orcid_id?: string | null;
}

/**
 * Frontend User structure (for compatibility with existing code)
 */
export interface User {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  fullName?: string; // Optionnel, peut venir du backend
  roles: string[]; // Role names for display
  roleIds: number[]; // Role IDs for API calls
  isActive: boolean;
  laboratoire?: string;
  specialite?: string;
  telephone?: string;
  dateCreation: string;
  derniereConnexion?: string;
  emailVerifie: boolean;
  avatar?: string;
}

/**
 * Paginated response from backend API
 */
export interface PaginatedUsersResponse {
  items: BackendUser[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

// Status is now simplified to Actif/Inactif based on isActive
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface UserFilters {
  search: string;
  roles: string[]; // Role names
  status: UserStatus | '';
  laboratoire: string;
  specialite: string;
  dateCreationDebut: string;
  dateCreationFin: string;
  derniereConnexion: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  suspended: number;
  byRole: Record<string, number>;
  byLaboratoire: Record<string, number>;
  newThisMonth: number;
  activeThisWeek: number;
}

export interface Pagination {
  page: number;
  size: number;
  total: number;
}

export interface CreateUserData {
  email: string;
  prenom: string;
  nom: string;
  roleIds: number[];
  laboratoire?: string;
  specialite?: string;
  telephone?: string;
  sendWelcomeEmail: boolean;
}

export interface UpdateUserData {
  prenom?: string;
  nom?: string;
  roleIds?: number[];
  laboratoire?: string;
  specialite?: string;
  telephone?: string;
  isActive?: boolean;
}

// Import mappers from formatters (to be created)
import { mapBackendUsersToFrontend, mapFrontendUserToBackendUpdate } from '../helpers/formatters';

/**
 * Custom hook to fetch gestion-utilisateurs list
 */
export function useFetchGestionUtilisateurs() {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    total: number;
    skip: number;
    limit: number;
    has_more: boolean;
  }>({
    total: 0,
    skip: 0,
    limit: 20,
    has_more: false,
  });
  const { showError } = useAlertStore();

  const fetch = async (skip: number = 0, limit: number = 20) => {
    setLoading(true);
    try {
      const response = await apiClient.get<PaginatedUsersResponse>('/users', {
        params: { skip, limit },
      });

      const mappedUsers = mapBackendUsersToFrontend(response.data.items);

      setData(mappedUsers);
      setPagination({
        total: response.data.total,
        skip: response.data.skip,
        limit: response.data.limit,
        has_more: response.data.has_more,
      });

      return mappedUsers;
    } catch (error: any) {
      showError(
        'Erreur de chargement',
        error.response?.data?.error || 'Impossible de charger les utilisateurs'
      );
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
    pagination,
  };
}

/**
 * Custom hook to fetch a single gestion-utilisateurs by ID
 */
export function useFetchGestionUtilisateursById() {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { showError } = useAlertStore();

  const fetch = async (id: string) => {
    setLoading(true);
    try {
      // For now, fetch all users and filter (as in original code)
      // TODO: Use dedicated /api/users/[id] if available
      const response = await apiClient.get<PaginatedUsersResponse>('/users', {
        params: { skip: 0, limit: 1000 },
      });

      const mappedUsers = mapBackendUsersToFrontend(response.data.items);
      const user = mappedUsers.find((u) => u.id === id);

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      setData(user);
      return user;
    } catch (error: any) {
      showError(
        'Erreur de chargement',
        error.response?.data?.error || 'Impossible de charger cet utilisateur'
      );
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

/**
 * Custom hook to fetch available roles
 */
export function useFetchRoles() {
  const [data, setData] = useState<Array<{ id: number; name: string; description: string }>>([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useAlertStore();

  const fetch = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<Array<{ id: number; name: string; description: string }>>('/roles');
      setData(response.data);
      return response.data;
    } catch (error: any) {
      showError(
        'Erreur de chargement',
        error.response?.data?.error || 'Impossible de charger les rôles'
      );
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
