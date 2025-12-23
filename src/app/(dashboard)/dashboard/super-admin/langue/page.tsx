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
  Chip,
} from '@mui/material';
import { Add, Search, Edit, Delete } from '@mui/icons-material';
import { useFetchLanguages } from './fetchers/useFetchLanguages';
import { useLanguageActions } from './fetchers/useLanguageActions';
import CreateLanguageDialog from './components/CreateLanguageDialog';
import EditLanguageDialog from './components/EditLanguageDialog';
import { useAlertStore } from '@/stores/alertStore';
import type { Language } from './fetchers/useFetchLanguages';

export default function GestionLanguePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const pageSize = 20;

  const { data: languages, loading, fetch } = useFetchLanguages();
  const { deleteLanguage, loading: actionLoading } = useLanguageActions();
  const { showConfirm } = useAlertStore();

  // Filtrage côté client
  const filteredLanguages = (languages || []).filter((language) =>
    language.name.toLowerCase().includes(search.toLowerCase()) ||
    language.code.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination côté client
  const totalPages = Math.ceil(filteredLanguages.length / pageSize);
  const paginatedLanguages = filteredLanguages.slice((page - 1) * pageSize, page * pageSize);

  const handleEdit = (language: Language) => {
    setSelectedLanguage(language);
    setOpenEditDialog(true);
  };

  const handleDelete = async (language: Language) => {
    const confirmed = await showConfirm(
      `Êtes-vous sûr de vouloir supprimer la langue "${language.name}" ?`,
      'Cette action est irréversible.'
    );

    if (confirmed) {
      try {
        await deleteLanguage(language.id);
        fetch();
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleSuccess = () => {
    fetch();
  };

  if (loading && !languages.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Gestion des Langues</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Nouvelle langue
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Rechercher par nom ou code..."
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
                  <TableCell>Code</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLanguages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Aucune langue trouvée
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLanguages.map((language) => (
                    <TableRow key={language.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {language.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={language.code.toUpperCase()}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(language)}
                            disabled={actionLoading}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(language)}
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

      <CreateLanguageDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={handleSuccess}
      />

      <EditLanguageDialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedLanguage(null);
        }}
        onSuccess={handleSuccess}
        language={selectedLanguage}
      />
    </Box>
  );
}
