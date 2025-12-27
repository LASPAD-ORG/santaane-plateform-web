'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Pagination,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Add, Search, Edit, Delete, LockReset } from '@mui/icons-material';
import { useCreateGestionUtilisateurs } from './fetchers/useCreateGestionUtilisateurs';
import { useFetchUsers } from './fetchers/useFetchUsers';
import CreateUserDialog from './components/CreateUserDialog';
import EditUserDialog from './components/EditUserDialog';
import ResetPasswordDialog from './components/ResetPasswordDialog';
import { useAlertStore } from '@/stores/alertStore';
import PageHeader from '@/components/ui/PageHeader';

export default function GestionUtilisateursPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const pageSize = 20;

  const { data: users, loading, fetch } = useFetchUsers();
  const { deleteUser, toggleUserStatus, loading: actionLoading } = useCreateGestionUtilisateurs();
  const { showConfirm } = useAlertStore();

  // Filtrage côté client
  const filteredUsers = (users || []).filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    user.roles.some((role) => role.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination côté client
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const handleEdit = (userId: number) => {
    setSelectedUserId(userId.toString());
    setOpenEditDialog(true);
  };

  const handleResetPassword = (user: any) => {
    setSelectedUserId(user.id.toString());
    setSelectedUserEmail(user.email);
    setOpenResetPasswordDialog(true);
  };

  const handleDelete = async (user: any) => {
    const confirmed = await showConfirm(
      `Êtes-vous sûr de vouloir supprimer "${user.fullName}" ?`,
      'Cette action est irréversible.'
    );

    if (confirmed) {
      try {
        await deleteUser(user.id.toString());
        fetch();
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleToggleStatus = async (user: any) => {
    try {
      await toggleUserStatus(user.id.toString(), !user.isActive);
      fetch();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleSuccess = () => {
    fetch();
  };

  if (loading && !users.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Gestion des Utilisateurs"
        action={{
          label: 'Nouvel utilisateur',
          icon: <Add />,
          onClick: () => setOpenCreateDialog(true),
        }}
      />

      <Card>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Rechercher par nom, email ou rôle..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Utilisateur</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rôles</TableCell>
                  <TableCell align="center">Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Aucun utilisateur trouvé
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {user.fullName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {user.roles.map((role) => (
                            <Chip
                              key={role.id}
                              label={role.name}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={user.isActive ? 'Actif' : 'Inactif'}
                          color={user.isActive ? 'success' : 'default'}
                          size="small"
                          onClick={() => handleToggleStatus(user)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(user.id)}
                            disabled={actionLoading}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Réinitialiser le mot de passe">
                          <IconButton
                            size="small"
                            onClick={() => handleResetPassword(user)}
                            disabled={actionLoading}
                            color="warning"
                          >
                            <LockReset fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(user)}
                            disabled={actionLoading}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      <CreateUserDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={handleSuccess}
      />

      <EditUserDialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedUserId(null);
        }}
        onSuccess={handleSuccess}
        userId={selectedUserId}
      />

      <ResetPasswordDialog
        open={openResetPasswordDialog}
        onClose={() => {
          setOpenResetPasswordDialog(false);
          setSelectedUserId(null);
          setSelectedUserEmail('');
        }}
        onSuccess={handleSuccess}
        userId={selectedUserId}
        userEmail={selectedUserEmail}
      />
    </Box>
  );
}
