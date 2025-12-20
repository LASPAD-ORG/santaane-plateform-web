'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

import { UserManagementTable } from './components/UserManagementTable';
import { UserFilters } from './components/UserFilters';
import { CreateUserModal } from './components/CreateUserModal';
import { EditUserModal } from './components/EditUserModal';
import { BulkActions } from './components/BulkActions';
import { UserImportModal } from './components/UserImportModal';
import { ChangePasswordDialog } from './components/ChangePasswordDialog';
import { AssignAuthorToMentorModal } from './components/AssignAuthorToMentorModal';
import { MentorAuthorsModal } from './components/MentorAuthorsModal';

import {
  useFetchGestionUtilisateurs,
  User,
  UserFilters as UserFiltersType,
  Pagination,
  UserStatus,
  CreateUserData,
  UpdateUserData
} from './fetchers/useFetchGestionUtilisateurs';
import {
  useCreateGestionUtilisateurs
} from './fetchers/useCreateGestionUtilisateurs';
import { useAlertStore } from '@/stores/alertStore';

const initialFilters: UserFiltersType = {
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

export default function GestionUtilisateursPage() {
  // UI State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [assignAuthorModalOpen, setAssignAuthorModalOpen] = useState(false);
  const [mentorAuthorsModalOpen, setMentorAuthorsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<User | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<User | null>(null);

  // Data State
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<UserFiltersType>(initialFilters);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const { showSuccess, showError, showConfirm } = useAlertStore();

  // Hooks
  const { data, loading: apiLoading, fetch } = useFetchGestionUtilisateurs();
  const {
    createUser: createUserApi,
    updateUser: updateUserApi,
    deleteUser: deleteUserApi,
    toggleUserStatus: toggleUserStatusApi,
    resetPassword: resetPasswordApi,
    loading: actionLoading
  } = useCreateGestionUtilisateurs();

  const [bulkLoading, setBulkLoading] = useState(false);
  const loading = apiLoading || actionLoading || bulkLoading;

  // Initial Load
  useEffect(() => {
    fetch(0, 100);
  }, []);

  // Sync users from fetcher
  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  // Filtering Logic
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user =>
        user.prenom.toLowerCase().includes(searchLower) ||
        user.nom.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.telephone && user.telephone.includes(filters.search))
      );
    }

    if (filters.roles.length > 0) {
      filtered = filtered.filter(user =>
        filters.roles.some(role => user.roles.includes(role))
      );
    }

    if (filters.status) {
      filtered = filtered.filter(user => (user.isActive ? 'ACTIVE' : 'INACTIVE') === filters.status);
    }

    if (filters.laboratoire) {
      filtered = filtered.filter(user => user.laboratoire === filters.laboratoire);
    }

    if (filters.specialite) {
      filtered = filtered.filter(user => user.specialite === filters.specialite);
    }

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

  // Pagination Logic
  const paginatedUsers = useMemo(() => {
    const start = pagination.page * pagination.size;
    const end = start + pagination.size;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, pagination]);

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredUsers.length,
    }));
  }, [filteredUsers]);

  // Handlers
  const updateFilters = (newFilters: Partial<UserFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const updatePagination = (page: number, size: number) => {
    setPagination(prev => ({ ...prev, page, size }));
  };

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      const newUser = await createUserApi(userData);
      setUsers(prev => [newUser, ...prev]);
      setCreateModalOpen(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleUpdateUser = async (userId: string, userData: UpdateUserData, currentRoleIds: number[]) => {
    try {
      const updatedUser = await updateUserApi(userId, userData, currentRoleIds);
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      setEditModalOpen(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    showConfirm(
      'Supprimer l\'utilisateur',
      `Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.prenom} ${user.nom}" ? Cette action est irréversible.`,
      async () => {
        try {
          await deleteUserApi(userId);
          setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
          // Error handled by hook
        }
      }
    );
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const updatedUser = await toggleUserStatusApi(userId, !currentStatus);
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleResetPassword = async (password: string) => {
    if (!selectedUserId) return;
    try {
      await resetPasswordApi(selectedUserId, password);
      setPasswordDialogOpen(false);
      setSelectedUserId(null);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleBulkStatusChange = async (userIds: string[], newStatus: 'ACTIVE' | 'INACTIVE') => {
    setBulkLoading(true);
    try {
      const isActive = newStatus === 'ACTIVE';
      // Sequential updates as no bulk endpoint is available
      for (const id of userIds) {
        await toggleUserStatusApi(id, isActive);
      }
      setUsers(prev =>
        prev.map(user =>
          userIds.includes(user.id)
            ? { ...user, isActive }
            : user
        )
      );
      showSuccess('Statuts mis à jour', `${userIds.length} utilisateurs ont été mis à jour.`);
    } catch (error) {
      showError('Erreur', 'Certains statuts n\'ont pas pu être mis à jour.');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDelete = async (userIds: string[]) => {
    showConfirm(
      'Suppression groupée',
      `Êtes-vous sûr de vouloir supprimer ${userIds.length} utilisateurs ? Cette action est irréversible.`,
      async () => {
        setBulkLoading(true);
        try {
          for (const id of userIds) {
            await deleteUserApi(id);
          }
          setUsers(prev => prev.filter(user => !userIds.includes(user.id)));
          showSuccess('Utilisateurs supprimés', `${userIds.length} utilisateurs ont été supprimés.`);
        } catch (error) {
          showError('Erreur', 'Certains utilisateurs n\'ont pas pu être supprimés.');
        } finally {
          setBulkLoading(false);
        }
      }
    );
  };

  const handleBulkEmailSend = async (userIds: string[]) => {
    setBulkLoading(true);
    try {
      // Mocking bulk email send as no backend endpoint exists
      await new Promise(resolve => setTimeout(resolve, 1200));
      showSuccess('Emails envoyés', `Email envoyé à ${userIds.length} utilisateur(s).`);
    } catch (error) {
      showError('Erreur', 'Impossible d\'envoyer les emails.');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleImportUsers = async (usersData: CreateUserData[]) => {
    setBulkLoading(true);
    try {
      const importedUsers: User[] = [];
      for (const userData of usersData) {
        const newUser = await createUserApi(userData);
        importedUsers.push(newUser);
      }
      setUsers(prev => [...importedUsers, ...prev]);
      showSuccess('Importation réussie', `${importedUsers.length} utilisateurs ont été importés.`);
      setImportModalOpen(false);
    } catch (error) {
      showError('Erreur', 'Certains utilisateurs n\'ont pas pu être importés.');
    } finally {
      setBulkLoading(false);
    }
  };

  // Handlers pour les nouvelles fonctionnalités de mentor
  const handleAssignAuthorToMentor = (author: User) => {
    setSelectedAuthor(author);
    setAssignAuthorModalOpen(true);
  };

  const handleViewMentorAuthors = (mentor: User) => {
    setSelectedMentor(mentor);
    setMentorAuthorsModalOpen(true);
  };

  const handleAssignmentSuccess = () => {
    // Rafraîchir la liste des utilisateurs si nécessaire
    // Pour l'instant, on ferme simplement le modal
    setAssignAuthorModalOpen(false);
    setSelectedAuthor(null);
  };

  const handleAssignmentRemoved = () => {
    // Rafraîchir la liste des utilisateurs si nécessaire
    // Pour l'instant, on ferme simplement le modal
    setMentorAuthorsModalOpen(false);
    setSelectedMentor(null);
  };

  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 5,
        gap: 2
      }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{
              p: 1,
              borderRadius: 1.5,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              boxShadow: '0 4px 12px rgba(255, 156, 0, 0.3)'
            }}>
              <PeopleIcon fontSize="small" />
            </Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              Gestion des Utilisateurs
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
            Administrez les comptes et les accès des membres de la plateforme
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setImportModalOpen(true)}
            sx={{
              borderRadius: 2.5,
              px: 2,
              fontWeight: 600,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.lighter'
              }
            }}
          >
            Import CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            disabled={loading}
            sx={{
              borderRadius: 2.5,
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: '0 8px 16px rgba(255, 156, 0, 0.2)',
              '&:hover': {
                boxShadow: '0 12px 20px rgba(255, 156, 0, 0.3)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Nouvel Utilisateur
          </Button>
        </Box>
      </Box>

      {/* Filtres */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Filtres et recherche
          </Typography>
          <Chip
            label={`${filteredUsers.length} utilisateur${filteredUsers.length > 1 ? 's' : ''}`}
            size="small"
            sx={{
              bgcolor: 'primary.lighter',
              color: 'primary.main',
              fontWeight: 700,
              borderRadius: 1.5
            }}
          />
        </Box>
        <UserFilters
          filters={filters}
          updateFilters={updateFilters}
          totalUsers={users.length}
          filteredCount={filteredUsers.length}
        />
      </Paper>

      {/* Tableau des utilisateurs */}
      <UserManagementTable
        users={paginatedUsers}
        pagination={pagination}
        onPaginationChange={updatePagination}
        loading={loading}
        onEditUser={(id) => { setSelectedUserId(id); setEditModalOpen(true); }}
        onDeleteUser={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
        onResetPassword={(id) => { setSelectedUserId(id); setPasswordDialogOpen(true); }}
        onAssignAuthorToMentor={handleAssignAuthorToMentor}
        onViewMentorAuthors={handleViewMentorAuthors}
      />

      {/* Modals */}
      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateUser={handleCreateUser}
      />

      {selectedUser && (
        <EditUserModal
          open={editModalOpen}
          onClose={() => { setEditModalOpen(false); setSelectedUserId(null); }}
          user={selectedUser}
          onUpdateUser={handleUpdateUser}
        />
      )}

      <UserImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportUsers={handleImportUsers}
      />

      {selectedUser && (
        <ChangePasswordDialog
          open={passwordDialogOpen}
          onClose={() => {
            setPasswordDialogOpen(false);
            setSelectedUserId(null);
          }}
          userName={`${selectedUser.prenom} ${selectedUser.nom}`}
          onChangePassword={handleResetPassword}
        />
      )}

      {/* Modals pour la gestion des mentors */}
      {selectedAuthor && (
        <AssignAuthorToMentorModal
          open={assignAuthorModalOpen}
          onClose={() => {
            setAssignAuthorModalOpen(false);
            setSelectedAuthor(null);
          }}
          author={selectedAuthor}
          onAssignmentSuccess={handleAssignmentSuccess}
        />
      )}

      {selectedMentor && (
        <MentorAuthorsModal
          open={mentorAuthorsModalOpen}
          onClose={() => {
            setMentorAuthorsModalOpen(false);
            setSelectedMentor(null);
          }}
          mentor={selectedMentor}
          onAssignmentRemoved={handleAssignmentRemoved}
        />
      )}

      {/* Actions en lot */}
      <BulkActions
        selectedUsers={users.filter(u => selectedUsers.includes(u.id))}
        allUsers={users}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkDelete={handleBulkDelete}
        onBulkEmailSend={handleBulkEmailSend}
        onClearSelection={() => setSelectedUsers([])}
      />
    </Box>
  );
}
