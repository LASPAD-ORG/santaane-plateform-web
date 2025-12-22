'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Paper,
  Avatar,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Add,
  Refresh,
  Edit,
  Delete,
  Palette,
  Brush,
} from '@mui/icons-material';
import { useFetchGestionTheme, GestionThemeItem } from './fetchers/useFetchGestionTheme';
import { useCreateGestionTheme, useUpdateGestionTheme, useDeleteGestionTheme } from './fetchers/useCreateGestionTheme';
import { validateGestionTheme, ValidationError } from './checkers/validators';
import { useAlertStore } from '@/stores/alertStore';

export default function GestionThemePage() {
  const { data: items, loading, fetch } = useFetchGestionTheme();
  const { create, loading: creating } = useCreateGestionTheme();
  const { update, loading: updating } = useUpdateGestionTheme();
  const { deleteItem, loading: deleting } = useDeleteGestionTheme();
  const { showConfirm } = useAlertStore();

  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GestionThemeItem | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    fetch();
  }, []);

  const handleOpen = (item?: GestionThemeItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({ title: item.title, description: item.description || '' });
    } else {
      setEditingItem(null);
      setFormData({ title: '', description: '' });
    }
    setErrors([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const validationErrors = validateGestionTheme(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingItem) {
        await update(editingItem.id, formData);
      } else {
        await create(formData);
      }
      handleClose();
      fetch();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDelete = (item: GestionThemeItem) => {
    showConfirm(
      'Supprimer le thème',
      `Êtes-vous sûr de vouloir supprimer le thème "${item.title}" ? Cette action est irréversible.`,
      async () => {
        try {
          await deleteItem(item.id);
          fetch();
        } catch (error) {
          // Error handled by hook
        }
      }
    );
  };

  const getError = (field: string) => errors.find((e) => e.field === field)?.message;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
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
              <Palette fontSize="small" />
            </Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              Gestion des Thèmes
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
            Définissez et gérez les thèmes visuels de votre plateforme
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Tooltip title="Actualiser la liste">
            <IconButton
              onClick={() => fetch()}
              disabled={loading}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              <Refresh fontSize="small" sx={{ animation: loading ? 'spin 2s linear infinite' : 'none' }} />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
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
            Nouveau Thème
          </Button>
        </Box>
      </Box>

      {/* Main Content - Premium Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          bgcolor: 'background.paper'
        }}
      >
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', py: 2.5 }}>Titre</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', py: 2.5 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', py: 2.5 }}>Date de création</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', py: 2.5 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !items ? (
              // Skeleton Loading Rows
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton variant="text" width={120} height={24} />
                    </Box>
                  </TableCell>
                  <TableCell><Skeleton variant="text" width="80%" height={20} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} height={20} /></TableCell>
                  <TableCell align="right"><Skeleton variant="circular" width={32} height={32} sx={{ ml: 'auto' }} /></TableCell>
                </TableRow>
              ))
            ) : items && items.length > 0 ? (
              items.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: alpha('#ff9c00', 0.02),
                      '& .row-actions': { opacity: 1 }
                    }
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.lighter',
                          color: 'primary.main',
                          width: 40,
                          height: 40,
                          borderRadius: 1.5,
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}
                      >
                        <Brush fontSize="small" />
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {item.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{
                      maxWidth: 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontStyle: item.description ? 'normal' : 'italic',
                      opacity: item.description ? 1 : 0.6
                    }}>
                      {item.description || 'Aucune description'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(item.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2 }}>
                    <Box className="row-actions" sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1,
                      opacity: { xs: 1, md: 0.4 },
                      transition: 'opacity 0.2s'
                    }}>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => handleOpen(item)}
                          sx={{ '&:hover': { color: 'primary.main', bgcolor: 'primary.lighter' } }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(item)}
                          sx={{ '&:hover': { color: 'error.main', bgcolor: 'error.lighter' } }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Empty State Row
              <TableRow>
                <TableCell colSpan={4} sx={{ py: 10, textAlign: 'center' }}>
                  <Box sx={{ color: 'text.disabled', mb: 2 }}>
                    <Palette sx={{ fontSize: 48, opacity: 0.2 }} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Aucun thème trouvé
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Commencez par créer un nouveau thème.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
            boxShadow: '0 24px 48px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', pb: 1 }}>
          {editingItem ? 'Modifier le thème' : 'Nouveau thème'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {editingItem
              ? "Modifiez les informations du thème ci-dessous."
              : "Remplissez les informations pour créer un nouveau thème."}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Titre du thème"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={!!getError('title')}
              helperText={getError('title')}
              disabled={creating || updating}
              placeholder="Ex: Thème par défaut, Thème sombre..."
              InputProps={{
                sx: { borderRadius: 2.5, bgcolor: 'grey.50' }
              }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={!!getError('description')}
              helperText={getError('description')}
              disabled={creating || updating}
              placeholder="Décrivez ce thème et ses caractéristiques..."
              InputProps={{
                sx: { borderRadius: 2.5, bgcolor: 'grey.50' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={creating || updating}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={creating || updating}
            sx={{
              borderRadius: 2.5,
              px: 4,
              fontWeight: 600,
              minWidth: 140
            }}
          >
            {(creating || updating) ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              editingItem ? 'Enregistrer' : 'Créer le thème'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
}
