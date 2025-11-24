'use client';

import { useState } from 'react';
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
  Download as DownloadIcon,
} from '@mui/icons-material';

import { UserManagementTable } from './components/UserManagementTable';
import { UserFilters } from './components/UserFilters';
import { CreateUserModal } from './components/CreateUserModal';
import { EditUserModal } from './components/EditUserModal';
import { UserStats } from './components/UserStats';
import { BulkActions } from './components/BulkActions';
import { UserImportModal } from './components/UserImportModal';
import { useUserManagement } from './hooks/useUserManagement';

export default function GestionUtilisateursPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const {
    users,
    filteredUsers,
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
    bulkStatusChange,
    bulkDelete,
    bulkEmailSend,
    importUsers,
  } = useUserManagement();

  const handleEditUser = (userId: string) => {
    setSelectedUserId(userId);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedUserId(null);
    setEditModalOpen(false);
  };

  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PeopleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Gestion des Utilisateurs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administration des comptes utilisateurs et attribution des rôles
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setImportModalOpen(true)}
          >
            Import CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            sx={{ minWidth: 180 }}
          >
            Nouvel Utilisateur
          </Button>
        </Box>
      </Box>


      {/* Filtres */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          Filtres et recherche
          <Chip 
            label={`${filteredUsers.length} utilisateur${filteredUsers.length > 1 ? 's' : ''}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Typography>
        <UserFilters 
          filters={filters}
          updateFilters={updateFilters}
          totalUsers={users.length}
          filteredCount={filteredUsers.length}
        />
      </Paper>

      {/* Tableau des utilisateurs */}
      <UserManagementTable
        users={filteredUsers}
        pagination={pagination}
        onPaginationChange={updatePagination}
        loading={loading}
        onEditUser={handleEditUser}
        onDeleteUser={deleteUser}
        onToggleStatus={toggleUserStatus}
        onResetPassword={resetPassword}
      />

      {/* Modals */}
      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateUser={createUser}
      />

      {selectedUser && (
        <EditUserModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          user={selectedUser}
          onUpdateUser={updateUser}
        />
      )}

      <UserImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportUsers={importUsers}
      />

      {/* Actions en lot */}
      <BulkActions
        selectedUsers={users.filter(u => selectedUsers.includes(u.id))}
        allUsers={users}
        onBulkStatusChange={bulkStatusChange}
        onBulkDelete={bulkDelete}
        onBulkEmailSend={bulkEmailSend}
        onClearSelection={() => setSelectedUsers([])}
      />
    </Box>
  );
}
