'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import { useFetchCategories } from './fetchers/useFetchCategories';
import { useCreateCategory } from './fetchers/useCreateCategory';
import { CategoryCard } from './components/CategoryCard';

export default function GestionCategoriesPage() {
  const { data: categories, loading, fetch, refresh } = useFetchCategories();
  const { create, loading: creating } = useCreateCategory();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
  });

  useEffect(() => {
    fetch();
  }, []);

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
    setFormData({ name: '', description: '', parentId: '' });
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleSubmitCategory = async () => {
    const success = await create({
      name: formData.name,
      description: formData.description,
      parentId: formData.parentId || undefined,
    });

    if (success) {
      handleCloseCreateDialog();
      refresh();
    }
  };

  // Séparer les catégories parents et enfants
  const rootCategories = categories?.filter((c) => !c.parentId) || [];
  const childCategories = categories?.filter((c) => c.parentId) || [];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestion des Catégories
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Créer une catégorie
        </Button>
      </Stack>

      {loading && (
        <Typography variant="body1" color="text.secondary">
          Chargement...
        </Typography>
      )}

      {!loading && categories && categories.length === 0 && (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <CategoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Aucune catégorie trouvée
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Créez votre première catégorie pour organiser les manuscrits.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
          >
            Créer une catégorie
          </Button>
        </Card>
      )}

      {!loading && rootCategories.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Catégories principales ({rootCategories.length})
          </Typography>
          <Grid container spacing={3} mb={4}>
            {rootCategories.map((category) => {
              const children = childCategories.filter(
                (c) => c.parentId === category.id
              );
              return (
                <Grid item xs={12} md={6} lg={4} key={category.id}>
                  <CategoryCard
                    category={category}
                    childrenCount={children.length}
                    onRefresh={refresh}
                  />
                </Grid>
              );
            })}
          </Grid>

          {childCategories.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Sous-catégories ({childCategories.length})
              </Typography>
              <Grid container spacing={3}>
                {childCategories.map((category) => {
                  const parent = categories?.find((c) => c.id === category.parentId);
                  return (
                    <Grid item xs={12} md={6} lg={4} key={category.id}>
                      <CategoryCard
                        category={category}
                        parentName={parent?.name}
                        onRefresh={refresh}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
        </>
      )}

      {/* Dialog de création de catégorie */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Créer une catégorie</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Nom de la catégorie"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ex: Sciences Environnementales"
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description de la catégorie..."
            />

            <FormControl fullWidth>
              <InputLabel>Catégorie parente (optionnel)</InputLabel>
              <Select
                value={formData.parentId}
                onChange={(e) =>
                  setFormData({ ...formData, parentId: e.target.value })
                }
                label="Catégorie parente (optionnel)"
              >
                <MenuItem value="">
                  <em>Aucune (catégorie principale)</em>
                </MenuItem>
                {rootCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Annuler</Button>
          <Button
            onClick={handleSubmitCategory}
            variant="contained"
            disabled={creating || !formData.name}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
