'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
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
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useFetchRoleAssignments } from './fetchers/useFetchRoleAssignments';
import { useCreateRoleAssignment } from './fetchers/useCreateRoleAssignment';
import { RoleAssignmentCard } from './components/RoleAssignmentCard';

export default function GestionRolesPage() {
  const { data: roleAssignments, loading, fetch, refresh } = useFetchRoleAssignments();
  const { create, loading: creating } = useCreateRoleAssignment();
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    userEmail: '',
    role: '',
    laboratoryId: '',
  });

  useEffect(() => {
    fetch();
  }, []);

  const handleOpenAssignDialog = () => {
    setAssignDialogOpen(true);
    setFormData({ userEmail: '', role: '', laboratoryId: '' });
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
  };

  const handleSubmitAssignment = async () => {
    const success = await create({
      userEmail: formData.userEmail,
      role: formData.role,
      laboratoryId: formData.laboratoryId,
    });

    if (success) {
      handleCloseAssignDialog();
      refresh();
    }
  };

  const filteredAssignments = roleAssignments?.filter((assignment) => {
    if (roleFilter === 'all') return true;
    return assignment.role === roleFilter;
  });

  const roleCounts = {
    all: roleAssignments?.length || 0,
    MENTOR: roleAssignments?.filter((a) => a.role === 'MENTOR').length || 0,
    EVALUATOR: roleAssignments?.filter((a) => a.role === 'EVALUATOR').length || 0,
    AUTHOR: roleAssignments?.filter((a) => a.role === 'AUTHOR').length || 0,
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestion des Rôles
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAssignDialog}
        >
          Attribuer un rôle
        </Button>
      </Stack>

      <Card sx={{ mb: 3, p: 2 }}>
        <Tabs
          value={roleFilter}
          onChange={(_, value) => setRoleFilter(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={`Tous (${roleCounts.all})`} value="all" />
          <Tab label={`Mentors (${roleCounts.MENTOR})`} value="MENTOR" />
          <Tab label={`Évaluateurs (${roleCounts.EVALUATOR})`} value="EVALUATOR" />
          <Tab label={`Auteurs (${roleCounts.AUTHOR})`} value="AUTHOR" />
        </Tabs>
      </Card>

      {loading && (
        <Typography variant="body1" color="text.secondary">
          Chargement...
        </Typography>
      )}

      {!loading && filteredAssignments && filteredAssignments.length === 0 && (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <AssignmentIndIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Aucune attribution de rôle trouvée
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {roleFilter === 'all'
              ? 'Aucune attribution de rôle pour le moment.'
              : `Aucune attribution pour le rôle "${roleFilter}".`}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAssignDialog}
            sx={{ mt: 2 }}
          >
            Attribuer un rôle
          </Button>
        </Card>
      )}

      {!loading && filteredAssignments && filteredAssignments.length > 0 && (
        <Grid container spacing={3}>
          {filteredAssignments.map((assignment) => (
            <Grid item xs={12} md={6} lg={4} key={assignment.id}>
              <RoleAssignmentCard
                assignment={assignment}
                onRefresh={refresh}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog d'attribution de rôle */}
      <Dialog
        open={assignDialogOpen}
        onClose={handleCloseAssignDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Attribuer un rôle</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Email de l'utilisateur"
              fullWidth
              required
              value={formData.userEmail}
              onChange={(e) =>
                setFormData({ ...formData, userEmail: e.target.value })
              }
              placeholder="exemple@email.com"
              helperText="Entrez l'email de l'utilisateur à qui vous voulez attribuer un rôle"
            />

            <FormControl fullWidth required>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                label="Rôle"
              >
                <MenuItem value="MENTOR">Mentor</MenuItem>
                <MenuItem value="EVALUATOR">Évaluateur</MenuItem>
                <MenuItem value="AUTHOR">Auteur</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Laboratoire</InputLabel>
              <Select
                value={formData.laboratoryId}
                onChange={(e) =>
                  setFormData({ ...formData, laboratoryId: e.target.value })
                }
                label="Laboratoire"
              >
                <MenuItem value="lab-1">Laboratoire de Recherche en IA</MenuItem>
                <MenuItem value="lab-2">
                  Laboratoire de Sciences Environnementales
                </MenuItem>
                <MenuItem value="lab-3">Laboratoire de Sociologie Appliquée</MenuItem>
                <MenuItem value="lab-4">
                  Laboratoire de Mathématiques et Modélisation
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Annuler</Button>
          <Button
            onClick={handleSubmitAssignment}
            variant="contained"
            disabled={
              creating ||
              !formData.userEmail ||
              !formData.role ||
              !formData.laboratoryId
            }
          >
            Attribuer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
