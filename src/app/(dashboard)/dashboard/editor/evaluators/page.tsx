'use client';

import { useState, useEffect } from 'react';
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
  Chip,
  Avatar,
  Pagination,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Email,
  CheckCircle,
  Search,
  Block,
  PlayCircle,
  Delete,
} from '@mui/icons-material';
import axios from 'axios';
import { useEvaluators } from './hooks/useEvaluators';
import CreateEvaluatorDialog from './components/CreateEvaluatorDialog';
import PageHeader from '@/components/ui/PageHeader';
import { useAlertStore } from '@/stores/alertStore';
import { Evaluator } from '@/types/evaluator';

function categoryFromRoles(roles: { name: string }[] | undefined): 'internal' | 'external' | null {
  if (!roles || roles.length === 0) return null;
  const names = roles.map((r) => r.name);
  if (names.includes('INTERNAL_EVALUATOR')) return 'internal';
  if (names.includes('EVALUATOR')) return 'external';
  return null;
}

export default function EvaluatorsPage() {
  const { showSuccess, showError } = useAlertStore();
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [tab, setTab] = useState<'external' | 'internal'>('external');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [actioningId, setActioningId] = useState<number | null>(null);
  const [toDelete, setToDelete] = useState<Evaluator | null>(null);
  const pageSize = 20;

  // Debounce de la recherche
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { evaluators, total, loading, refetch } = useEvaluators(page, pageSize, tab, search);
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (_: unknown, value: number) => setPage(value);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleSuccess = () => refetch();

  const handleTabChange = (_: unknown, value: 'external' | 'internal') => {
    setTab(value);
    setPage(1);
  };

  const handleToggleActive = async (evaluator: Evaluator) => {
    setActioningId(evaluator.id);
    try {
      const res = await fetch(`/api/evaluators/${evaluator.id}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !evaluator.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Échec de la mise à jour');
      showSuccess(evaluator.isActive ? 'Compte désactivé.' : 'Compte activé.');
      refetch();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setActioningId(null);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setActioningId(toDelete.id);
    try {
      const res = await fetch(`/api/evaluators/${toDelete.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Échec de la suppression');
      showSuccess('Évaluateur supprimé (compte désactivé).');
      setToDelete(null);
      refetch();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setActioningId(null);
    }
  };

  if (loading && evaluators.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Gestion des évaluateurs"
        subtitle={`${total} évaluateur${total > 1 ? 's' : ''} au total`}
        action={{
          label: 'Ajouter un évaluateur',
          icon: <Add />,
          onClick: () => handleOpenDialog(),
        }}
      />

      <Card sx={{ mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label="Évaluateurs externes" value="external" />
            <Tab label="Évaluateurs internes" value="internal" />
          </Tabs>
        </Box>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Rechercher par nom ou email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Card>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Évaluateur</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell>Institution</TableCell>
                  <TableCell>ORCID</TableCell>
                  <TableCell align="center">Statut</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {evaluators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Typography variant="body1" color="text.secondary">
                        Aucun évaluateur trouvé
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  evaluators.map((evaluator) => {
                    const cat = categoryFromRoles(evaluator.roles);
                    return (
                      <TableRow key={evaluator.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar src={evaluator.profilePhoto} alt={evaluator.fullName}>
                              {evaluator.fullName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="500">
                                {evaluator.fullName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {evaluator.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Email fontSize="small" color="action" />
                            <Typography variant="body2">{evaluator.email}</Typography>
                            {evaluator.emailVerified && (
                              <Tooltip title="Email vérifié">
                                <CheckCircle fontSize="small" color="success" />
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {cat === 'internal' ? (
                            <Chip label="Interne" size="small" color="secondary" variant="outlined" />
                          ) : cat === 'external' ? (
                            <Chip label="Externe" size="small" color="info" variant="outlined" />
                          ) : (
                            <Typography variant="body2">-</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{evaluator.institution || '-'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace" fontSize="0.85rem">
                            {evaluator.orcidId || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={evaluator.isActive ? 'Actif' : 'Inactif'}
                            color={evaluator.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={evaluator.isActive ? 'Désactiver' : 'Activer'}>
                            <span>
                              <IconButton
                                size="small"
                                color={evaluator.isActive ? 'warning' : 'success'}
                                disabled={actioningId === evaluator.id}
                                onClick={() => handleToggleActive(evaluator)}
                              >
                                {evaluator.isActive ? (
                                  <Block fontSize="small" />
                                ) : (
                                  <PlayCircle fontSize="small" />
                                )}
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <span>
                              <IconButton
                                size="small"
                                color="error"
                                disabled={actioningId === evaluator.id}
                                onClick={() => setToDelete(evaluator)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </span>
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
            <Box display="flex" justifyContent="center" p={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      <CreateEvaluatorDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />

      <Dialog open={Boolean(toDelete)} onClose={() => setToDelete(null)}>
        <DialogTitle>Supprimer cet évaluateur ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Le compte de <strong>{toDelete?.fullName}</strong> sera désactivé. Cette action peut être
            annulée en réactivant le compte.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Annuler</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={actioningId === toDelete?.id}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}