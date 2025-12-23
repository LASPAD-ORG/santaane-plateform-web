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
import { useFetchThemes } from './fetchers/useFetchThemes';
import { useThemeActions } from './fetchers/useThemeActions';
import CreateThemeDialog from './components/CreateThemeDialog';
import EditThemeDialog from './components/EditThemeDialog';
import { useAlertStore } from '@/stores/alertStore';
import type { Theme } from './fetchers/useFetchThemes';

export default function GestionThemePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const pageSize = 20;

  const { data: themes, loading, fetch } = useFetchThemes();
  const { deleteTheme, loading: actionLoading } = useThemeActions();
  const { showConfirm } = useAlertStore();

  // Filtrage côté client
  const filteredThemes = (themes || []).filter((theme) =>
    theme.title.toLowerCase().includes(search.toLowerCase()) ||
    theme.description.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination côté client
  const totalPages = Math.ceil(filteredThemes.length / pageSize);
  const paginatedThemes = filteredThemes.slice((page - 1) * pageSize, page * pageSize);

  const handleEdit = (theme: Theme) => {
    setSelectedTheme(theme);
    setOpenEditDialog(true);
  };

  const handleDelete = async (theme: Theme) => {
    const confirmed = await showConfirm(
      `Êtes-vous sûr de vouloir supprimer le thème "${theme.title}" ?`,
      'Cette action est irréversible.'
    );

    if (confirmed) {
      try {
        await deleteTheme(theme.id);
        fetch();
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleSuccess = () => {
    fetch();
  };

  if (loading && !themes.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Gestion des Thèmes</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Nouveau thème
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Rechercher par titre ou description..."
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
                  <TableCell>Titre</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedThemes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Aucun thème trouvé
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedThemes.map((theme) => (
                    <TableRow key={theme.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {theme.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {theme.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(theme)}
                            disabled={actionLoading}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(theme)}
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

      <CreateThemeDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={handleSuccess}
      />

      <EditThemeDialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedTheme(null);
        }}
        onSuccess={handleSuccess}
        theme={selectedTheme}
      />
    </Box>
  );
}
