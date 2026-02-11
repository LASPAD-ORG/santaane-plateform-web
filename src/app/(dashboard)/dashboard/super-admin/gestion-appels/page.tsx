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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Add, Search, Edit, Delete, FilterList } from '@mui/icons-material';
import { useFetchThemes } from './fetchers/useFetchThemes';
import { useThemeActions } from './fetchers/useThemeActions';
import CreateThemeDialog from './components/CreateThemeDialog';
import EditThemeDialog from './components/EditThemeDialog';
import { useAlertStore } from '@/stores/alertStore';
import { getAppelStatusText, formatDateForDisplay } from './utils/themeUtils';
import type { Theme } from './fetchers/useFetchThemes';
import PageHeader from '@/components/ui/PageHeader';

export default function GestionAppelsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'expired'>('all');
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
      `Êtes-vous sûr de vouloir supprimer l'appel "${theme.title}" ?`,
      'Cette action est irréversible.'
    );

    if (confirmed) {
      try {
        await deleteTheme(theme.id);
        fetch(0, 100, filterType);
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleSuccess = () => {
    fetch(0, 100, filterType);
  };

  const handleFilterChange = (newFilter: 'all' | 'active' | 'expired') => {
    setFilterType(newFilter);
    setPage(1);
    fetch(0, 100, newFilter);
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
      <PageHeader
        title="Gestion des Appels"
        action={{
          label: 'Nouvel appel',
          icon: <Add />,
          onClick: () => setOpenCreateDialog(true),
        }}
      />

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.666% - 8px)' } }}>
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
              />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 8px)' } }}>
              <FormControl fullWidth>
                <InputLabel id="filter-label">Filtrer par statut</InputLabel>
                <Select
                  labelId="filter-label"
                  value={filterType}
                  label="Filtrer par statut"
                  onChange={(e) => handleFilterChange(e.target.value as 'all' | 'active' | 'expired')}
                  startAdornment={<FilterList sx={{ mr: 1 }} />}
                >
                  <MenuItem value="all">Tous les appels</MenuItem>
                  <MenuItem value="active">Appels actifs</MenuItem>
                  <MenuItem value="expired">Appels expirés</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Titre</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Date limite</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedThemes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Aucun appel trouvé
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedThemes.map((theme) => {
                    const statusInfo = getAppelStatusText(theme.date_limite);
                    return (
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
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateForDisplay(theme.date_limite)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={statusInfo.text}
                          size="small"
                          sx={{ 
                            color: statusInfo.color,
                            bgcolor: 'transparent',
                            border: `1px solid ${statusInfo.color}`,
                            fontWeight: 500
                          }}
                        />
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
                    );
                  })
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
