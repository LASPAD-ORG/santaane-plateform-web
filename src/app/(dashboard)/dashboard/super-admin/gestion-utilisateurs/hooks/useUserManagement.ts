'use client';

import { useState, useEffect, useMemo } from 'react';
import { User, UserFilters, UserStats, Pagination, CreateUserData, UpdateUserData, UserStatus } from '../types';
import { UserRole } from '@/types/auth';
import { mockUsers } from '../fetchers/useFetchGestionUtilisateurs';
import { useAlertStore } from '@/stores/alertStore';



const initialFilters: UserFilters = {
  search: '',
  roles: [],
  status: '',
  laboratoire: '',
  specialite: '',
  dateCreationDebut: '',
  dateCreationFin: '',
  derniereConnexion: '',
};

const initialPagination: Pagination = {
  page: 0,
  size: 10,
  total: 0,
};

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<UserFilters>(initialFilters);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlertStore();

  // Simulation du chargement des données
  useEffect(() => {
    setLoading(true);
    // Simuler un délai d'API
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrage des utilisateurs
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    // Recherche textuelle
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user =>
        user.prenom.toLowerCase().includes(searchLower) ||
        user.nom.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.telephone && user.telephone.includes(filters.search))
      );
    }

    // Filtrage par rôles
    if (filters.roles.length > 0) {
      filtered = filtered.filter(user =>
        filters.roles.some(role => user.roles.includes(role))
      );
    }

    // Filtrage par statut
    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    // Filtrage par laboratoire
    if (filters.laboratoire) {
      filtered = filtered.filter(user => user.laboratoire === filters.laboratoire);
    }

    // Filtrage par spécialité
    if (filters.specialite) {
      filtered = filtered.filter(user => user.specialite === filters.specialite);
    }



    // Filtrage par dernière connexion
    if (filters.derniereConnexion) {
      const now = new Date();
      const filterDate = new Date();

      switch (filters.derniereConnexion) {
        case 'aujourd-hui':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(user =>
            user.derniereConnexion && new Date(user.derniereConnexion) >= filterDate
          );
          break;
        case 'semaine':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(user =>
            user.derniereConnexion && new Date(user.derniereConnexion) >= filterDate
          );
          break;
        case 'mois':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(user =>
            user.derniereConnexion && new Date(user.derniereConnexion) >= filterDate
          );
          break;
        case 'trimestre':
          filterDate.setMonth(now.getMonth() - 3);
          filtered = filtered.filter(user =>
            user.derniereConnexion && new Date(user.derniereConnexion) >= filterDate
          );
          break;
        case 'plus-3-mois':
          filterDate.setMonth(now.getMonth() - 3);
          filtered = filtered.filter(user =>
            !user.derniereConnexion || new Date(user.derniereConnexion) < filterDate
          );
          break;
      }
    }

    return filtered;
  }, [users, filters]);

  // Pagination des résultats
  const paginatedUsers = useMemo(() => {
    const start = pagination.page * pagination.size;
    const end = start + pagination.size;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, pagination]);

  // Mise à jour de la pagination totale
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredUsers.length,
    }));
  }, [filteredUsers]);

  // Calcul des statistiques
  const stats: UserStats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.status === UserStatus.ACTIVE).length;
    const inactive = users.filter(u => u.status === UserStatus.INACTIVE).length;
    const pending = users.filter(u => u.status === UserStatus.PENDING).length;
    const suspended = users.filter(u => u.status === UserStatus.SUSPENDED).length;

    const byRole: Record<UserRole, number> = Object.values(UserRole).reduce((acc, role) => {
      acc[role] = users.filter(u => u.roles.includes(role)).length;
      return acc;
    }, {} as Record<UserRole, number>);

    const byLaboratoire: Record<string, number> = users.reduce((acc, user) => {
      if (user.laboratoire) {
        acc[user.laboratoire] = (acc[user.laboratoire] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newThisMonth = users.filter(u =>
      new Date(u.dateCreation) >= thisMonth
    ).length;

    const activeThisWeek = users.filter(u =>
      u.derniereConnexion && new Date(u.derniereConnexion) >= thisWeek
    ).length;

    return {
      total,
      active,
      inactive,
      pending,
      suspended,
      byRole,
      byLaboratoire,
      newThisMonth,
      activeThisWeek,
    };
  }, [users]);

  // Fonctions de gestion
  const updateFilters = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 0 })); // Retour à la première page
  };

  const updatePagination = (page: number, size: number) => {
    setPagination(prev => ({ ...prev, page, size }));
  };

  const createUser = async (userData: CreateUserData): Promise<void> => {
    setLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        prenom: userData.prenom,
        nom: userData.nom,
        roles: userData.roles,
        status: UserStatus.PENDING,
        laboratoire: userData.laboratoire,
        specialite: userData.specialite,
        telephone: userData.telephone,
        dateCreation: new Date().toISOString(),
        emailVerifie: false,
        isActive: true,
      };

      setUsers(prev => [newUser, ...prev]);
      showSuccess('Utilisateur créé', 'L\'utilisateur a été créé avec succès.');
    } catch (error) {
      showError('Erreur', 'Impossible de créer l\'utilisateur.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, userData: UpdateUserData): Promise<void> => {
    setLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 800));

      setUsers(prev =>
        prev.map(user =>
          user.id === userId
            ? { ...user, ...userData }
            : user
        )
      );
      showSuccess('Utilisateur mis à jour', 'Les informations de l\'utilisateur ont été mises à jour.');
    } catch (error) {
      showError('Erreur', 'Impossible de mettre à jour l\'utilisateur.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string): Promise<void> => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    setLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 500));

      setUsers(prev => prev.filter(user => user.id !== userId));
      showSuccess('Utilisateur supprimé', 'L\'utilisateur a été supprimé avec succès.');
    } catch (error) {
      showError('Erreur', 'Impossible de supprimer l\'utilisateur.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, newStatus: UserStatus): Promise<void> => {
    setLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 500));

      setUsers(prev =>
        prev.map(user =>
          user.id === userId
            ? { ...user, status: newStatus, isActive: newStatus === UserStatus.ACTIVE }
            : user
        )
      );
      showSuccess('Statut mis à jour', 'Le statut de l\'utilisateur a été modifié.');
    } catch (error) {
      showError('Erreur', 'Impossible de modifier le statut de l\'utilisateur.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (userId: string): Promise<void> => {
    if (!window.confirm('Envoyer un email de réinitialisation du mot de passe à cet utilisateur ?')) {
      return;
    }

    setLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Email envoyé', 'Un email de réinitialisation a été envoyé à l\'utilisateur.');
    } catch (error) {
      showError('Erreur', 'Impossible d\'envoyer l\'email de réinitialisation.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Actions en lot
  const bulkStatusChange = async (userIds: string[], newStatus: UserStatus): Promise<void> => {
    setLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 800));

      setUsers(prev =>
        prev.map(user =>
          userIds.includes(user.id)
            ? { ...user, status: newStatus, isActive: newStatus === UserStatus.ACTIVE }
            : user
        )
      );
      showSuccess('Statuts mis à jour', `${userIds.length} utilisateurs ont été mis à jour.`);
    } catch (error) {
      showError('Erreur', 'Impossible de mettre à jour les statuts.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const bulkDelete = async (userIds: string[]): Promise<void> => {
    setLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUsers(prev => prev.filter(user => !userIds.includes(user.id)));
      showSuccess('Utilisateurs supprimés', `${userIds.length} utilisateurs ont été supprimés.`);
    } catch (error) {
      showError('Erreur', 'Impossible de supprimer les utilisateurs.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const bulkEmailSend = async (userIds: string[]): Promise<void> => {
    setLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1200));
      showSuccess('Emails envoyés', `Email envoyé à ${userIds.length} utilisateur(s).`);
    } catch (error) {
      showError('Erreur', 'Impossible d\'envoyer les emails.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const importUsers = async (usersData: CreateUserData[]): Promise<void> => {
    setLoading(true);
    try {
      // Simulation d'appel API pour import en masse
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newUsers: User[] = usersData.map(userData => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        email: userData.email,
        prenom: userData.prenom,
        nom: userData.nom,
        roles: userData.roles,
        status: UserStatus.PENDING,
        laboratoire: userData.laboratoire,
        specialite: userData.specialite,
        telephone: userData.telephone,
        dateCreation: new Date().toISOString(),
        emailVerifie: false,
        isActive: true,
      }));

      setUsers(prev => [...newUsers, ...prev]);
      showSuccess('Importation réussie', `${newUsers.length} utilisateurs ont été importés.`);
    } catch (error) {
      showError('Erreur', 'Impossible d\'importer les utilisateurs.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    filteredUsers: paginatedUsers,
    filters,
    updateFilters,
    pagination,
    updatePagination,
    stats,
    loading,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetPassword,
    // Actions en lot
    bulkStatusChange,
    bulkDelete,
    bulkEmailSend,
    importUsers,
  };
}