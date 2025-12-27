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
import { useFetchSections } from './fetchers/useFetchSections';
import { useSectionActions } from './fetchers/useSectionActions';
import CreateSectionDialog from './components/CreateSectionDialog';
import EditSectionDialog from './components/EditSectionDialog';
import { useAlertStore } from '@/stores/alertStore';
import type { Section } from './fetchers/useFetchSections';
import PageHeader from '@/components/ui/PageHeader';

export default function GestionRubriquesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const pageSize = 20;

  const { data: sections, loading, fetch } = useFetchSections();
  const { deleteSection, loading: actionLoading } = useSectionActions();
  const { showConfirm } = useAlertStore();

  // Filtrage côté client
  const filteredSections = (sections || []).filter((section) =>
    section.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination côté client
  const totalPages = Math.ceil(filteredSections.length / pageSize);
  const paginatedSections = filteredSections.slice((page - 1) * pageSize, page * pageSize);

  const handleEdit = (section: Section) => {
    setSelectedSection(section);
    setOpenEditDialog(true);
  };

  const handleDelete = async (section: Section) => {
    const confirmed = await showConfirm(
      `Êtes-vous sûr de vouloir supprimer la rubrique "${section.name}" ?`,
      'Cette action est irréversible.'
    );

    if (confirmed) {
      try {
        await deleteSection(section.id);
        fetch();
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleSuccess = () => {
    fetch();
  };

  if (loading && !sections.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
    
    <PageHeader
        title="Gestion des Rubriques"
        action={{
                label: 'Nouvelle rubrique',
                icon: <Add />,
                onClick: () => setOpenCreateDialog(true),
              }}
            />

      <Card>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Rechercher par nom..."
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
                  <TableCell align="center">Signes Min</TableCell>
                  <TableCell align="center">Signes Max</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Aucune rubrique trouvée
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSections.map((section) => (
                    <TableRow key={section.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {section.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {section.signe_min.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {section.signe_max.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(section)}
                            disabled={actionLoading}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(section)}
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

      <CreateSectionDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={handleSuccess}
      />

      <EditSectionDialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedSection(null);
        }}
        onSuccess={handleSuccess}
        section={selectedSection}
      />
    </Box>
  );
}
