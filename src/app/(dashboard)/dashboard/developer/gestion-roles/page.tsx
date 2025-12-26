'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Pagination,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Add, Search, Edit, Delete } from '@mui/icons-material';
import { useFetchRoles } from './fetchers/useFetchRoles';
import { useRoleActions } from './fetchers/useRoleActions';
import CreateRoleDialog from './components/CreateRoleDialog';
import EditRoleDialog from './components/EditRoleDialog';
import { useAlertStore } from '@/stores/alertStore';
import type { Role } from './fetchers/useFetchRoles';

export default function GestionRolesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const pageSize = 20;

  const { data: roles, loading, fetch } = useFetchRoles();
  const { deleteRole, loading: actionLoading } = useRoleActions();
  const { showConfirm } = useAlertStore();

  // Filtrage côté client
  const filteredRoles = (roles || []).filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase()) ||
    role.description.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination côté client
  const totalPages = Math.ceil(filteredRoles.length / pageSize);
  const paginatedRoles = filteredRoles.slice((page - 1) * pageSize, page * pageSize);

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setOpenEditDialog(true);
  };

  const handleDelete = async (role: Role) => {
    const confirmed = await showConfirm(
      `Êtes-vous sûr de vouloir supprimer le rôle "${role.name}" ?`,
      'Cette action est irréversible.'
    );

    if (confirmed) {
      try {
        await deleteRole(role.id);
        fetch();
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleSuccess = () => {
    fetch();
  };

  if (loading && !roles.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Gestion des Rôles</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Nouveau rôle
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Rechercher par nom ou description..."
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
                  <TableCell>Nom</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Aucun rôle trouvé
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRoles.map((role) => (
                    <TableRow key={role.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {role.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {role.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(role)}
                            disabled={actionLoading}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(role)}
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

      <CreateRoleDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={handleSuccess}
      />

      <EditRoleDialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedRole(null);
        }}
        onSuccess={handleSuccess}
        role={selectedRole}
      />
    </Box>
  );
}
