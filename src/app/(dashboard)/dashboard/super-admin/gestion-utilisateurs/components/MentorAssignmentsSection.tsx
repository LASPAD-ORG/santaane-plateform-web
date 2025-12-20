'use client';

import {
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { User } from '../fetchers/useFetchGestionUtilisateurs';
import { useMentorApi, Author, MentorAssignment } from '../fetchers/useMentorApi';
import { useAlertStore } from '@/stores/alertStore';
import { useAssignmentValidation } from '@/hooks/useAssignmentValidation';

interface MentorAssignmentsSectionProps {
  user: User;
  onAssignmentChange?: () => void;
}

export function MentorAssignmentsSection({ user, onAssignmentChange }: MentorAssignmentsSectionProps) {
  const [assignedAuthors, setAssignedAuthors] = useState<Author[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [addAuthorDialogOpen, setAddAuthorDialogOpen] = useState(false);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>('');
  const [assignmentLoading, setAssignmentLoading] = useState<string | null>(null);
  
  const { fetchMentorAuthors, assignAuthorToMentor, updateAssignment, deleteAssignment } = useMentorApi();
  const { showSuccess, showError } = useAlertStore();
  const { validateAssignment } = useAssignmentValidation();

  // Charger les auteurs assignés au mentor
  const loadAssignedAuthors = async () => {
    try {
      setLoading(true);
      const authors = await fetchMentorAuthors(user.id);
      setAssignedAuthors(authors);
    } catch (error) {
      console.error('Erreur lors du chargement des auteurs assignés:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les auteurs disponibles (non assignés à ce mentor)
  const loadAvailableAuthors = async () => {
    try {
      console.log('Chargement des auteurs disponibles pour le mentor:', user.id);
      
      // Récupérer uniquement les utilisateurs avec le rôle AUTHOR
      const response = await fetch('/api/users?role=AUTHOR&limit=100');
      const data = await response.json();
      const allAuthors = data.items || [];
      
      console.log('Auteurs récupérés depuis l\'API:', allAuthors.length);
      
      // Filtrer pour n'avoir que les auteurs actifs avec données complètes
      const authorsWithCompleteData = allAuthors.filter((author: User) => {
        const isActive = author.isActive;
        const hasAnyName = author.prenom || author.nom || author.fullName;
        const isValid = isActive && hasAnyName;
        
        if (!isValid) {
          console.log('Auteur filtré (invalide):', {
            id: author.id,
            prenom: author.prenom,
            nom: author.nom,
            fullName: author.fullName,
            isActive: author.isActive,
            hasAnyName
          });
        }
        
        return isValid;
      });
      
      console.log('Auteurs avec données complètes:', authorsWithCompleteData.length);
      
      // Filtrer les auteurs qui n'ont PAS de mentor actif (règle métier: 1 auteur = 1 mentor actif)
      const available = authorsWithCompleteData.filter((author: User) => {
        const validation = validateAssignment(parseInt(author.id));
        const canAssign = validation.isValid;
        
        if (!canAssign) {
          console.log('Auteur filtré (déjà assigné):', {
            id: author.id,
            fullName: author.fullName || `${author.prenom} ${author.nom}`,
            reason: validation.message,
            activeAssignment: validation.activeAssignment
          });
        }
        
        return canAssign;
      });
      
      console.log('Auteurs disponibles après filtrage:', available.length);
      
      setAvailableAuthors(available);
    } catch (error) {
      console.error('Erreur lors du chargement des auteurs disponibles:', error);
    }
  };

  useEffect(() => {
    loadAssignedAuthors();
  }, [user.id]);

  useEffect(() => {
    // Toujours charger les auteurs disponibles, même si aucun n'est assigné
    loadAvailableAuthors();
  }, [user.id, assignedAuthors.length]);

  // Ajouter un auteur au mentor
  const handleAddAuthor = async () => {
    if (!selectedAuthorId) return;

    try {
      setAssignmentLoading('add');
      
      // Valider si l'auteur peut être assigné
      const validation = validateAssignment(parseInt(selectedAuthorId));
      if (!validation.isValid) {
        showError('Assignation impossible', validation.message);
        return;
      }

      await assignAuthorToMentor({
        mentor_id: parseInt(user.id),
        author_id: parseInt(selectedAuthorId),
      });

      showSuccess('Assignation réussie', 'L\'auteur a été assigné au mentor avec succès');
      setAddAuthorDialogOpen(false);
      setSelectedAuthorId('');
      // Recharger les données pour refléter les changements
      await loadAssignedAuthors();
      await loadAvailableAuthors();
      onAssignmentChange?.();
    } catch (error: any) {
      console.error('Erreur lors de l\'assignation:', error);
      showError('Erreur', error.response?.data?.detail || 'Erreur lors de l\'assignation');
    } finally {
      setAssignmentLoading(null);
    }
  };

  // Activer/désactiver une assignation
  const handleToggleAssignment = async (assignment: MentorAssignment) => {
    try {
      setAssignmentLoading(assignment.id);
      
      await updateAssignment(assignment.id, {
        is_active: !assignment.is_active,
      });

      showSuccess(
        'Assignation mise à jour',
        `L'assignation a été ${assignment.is_active ? 'désactivée' : 'activée'}`
      );
      loadAssignedAuthors();
      onAssignmentChange?.();
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de l\'assignation:', error);
      showError('Erreur', error.response?.data?.detail || 'Erreur lors de la mise à jour');
    } finally {
      setAssignmentLoading(null);
    }
  };

  // Supprimer une assignation
  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      setAssignmentLoading('delete');
      await deleteAssignment(assignmentId);
      showSuccess('Assignation supprimée', 'L\'assignation a été supprimée avec succès');
      onAssignmentChange?.();
      // Recharger les données pour refléter les changements
      await loadAssignedAuthors();
      await loadAvailableAuthors();
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'assignation:', error);
      showError('Erreur', error.response?.data?.detail || 'Erreur lors de la suppression');
    } finally {
      setAssignmentLoading(null);
    }
  };

  const getAuthorInitials = (author: Author) => {
    // Utiliser fullname si disponible, sinon nom/prénom
    if (author.fullName) {
      const names = author.fullName.split(' ');
      const first = names[0] ? names[0].charAt(0) : '';
      const last = names[names.length - 1] ? names[names.length - 1].charAt(0) : '';
      return `${first}${last}`.toUpperCase();
    }
    
    const first = author.prenom ? author.prenom.charAt(0) : '';
    const last = author.nom ? author.nom.charAt(0) : '';
    return `${first}${last}`.toUpperCase();
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupIcon />
          Auteurs assignés ({assignedAuthors.length})
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          onClick={() => setAddAuthorDialogOpen(true)}
          disabled={loading}
          size="small"
        >
          Ajouter un auteur
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : assignedAuthors.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Ce mentor n'a aucun auteur assigné actuellement.
        </Alert>
      ) : (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          {assignedAuthors.map((author, index) => (
            <Box key={author.id}>
              <ListItem
                secondaryAction={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={author.isActive}
                          onChange={() => handleToggleAssignment({
                            id: author.id,
                            author_id: parseInt(author.id),
                            mentor_id: parseInt(user.id),
                            assigned_by: 0,
                            is_active: !author.isActive,
                            created_at: '',
                            updated_at: '',
                            author,
                          })}
                          disabled={assignmentLoading === author.id}
                          size="small"
                        />
                      }
                      label={author.isActive ? 'Actif' : 'Inactif'}
                    />
                    
                    <Tooltip title="Supprimer l'assignation">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          // Trouver l'assignation correspondante pour l'auteur
                          const assignment = assignedAuthors.find(a => a.id === author.id);
                          if (assignment) {
                            handleDeleteAssignment(assignment.id);
                          }
                        }}
                        disabled={assignmentLoading === 'delete'}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {getAuthorInitials(author)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }} component="span">
                        {author.fullName || `${author.prenom} ${author.nom}`}
                      </Typography>
                      <Chip
                        label="AUTHOR"
                        size="small"
                        sx={{
                          backgroundColor: '#f57c0020',
                          color: '#f57c00',
                          border: '1px solid #f57c0040',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                      <Chip
                        label={author.isActive ? 'Actif' : 'Inactif'}
                        size="small"
                        color={author.isActive ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box component="span" sx={{ mt: 0.5, display: 'block' }}>
                      <Typography variant="body2" color="text.secondary" component="span">
                        {author.email}
                      </Typography>
                      {author.laboratoire && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <BusinessIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary" component="span">
                            {author.laboratoire}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < assignedAuthors.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}

      {/* Dialog pour ajouter un auteur */}
      <Dialog open={addAuthorDialogOpen} onClose={() => setAddAuthorDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PersonAddIcon sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant="h6">Ajouter un auteur</Typography>
              <Typography variant="body2" color="text.secondary">
                Assigner un nouvel auteur à {user.prenom} {user.nom}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <FormControl fullWidth required sx={{ mt: 2 }}>
            <InputLabel>Sélectionner un auteur</InputLabel>
            <Select
              value={selectedAuthorId}
              label="Sélectionner un auteur"
              onChange={(e) => setSelectedAuthorId(e.target.value)}
              disabled={assignmentLoading === 'add'}
            >
              {availableAuthors.length === 0 ? (
                <MenuItem disabled>
                  <Typography color="text.secondary" component="span">Aucun auteur disponible</Typography>
                </MenuItem>
              ) : (
                availableAuthors.map((author) => (
                  <MenuItem key={author.id} value={author.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {(() => {
                          if (author.fullName) {
                            const names = author.fullName.split(' ');
                            const first = names[0] ? names[0].charAt(0) : '';
                            const last = names[names.length - 1] ? names[names.length - 1].charAt(0) : '';
                            return `${first}${last}`.toUpperCase();
                          }
                          if (author.prenom && author.nom) {
                            return `${author.prenom.charAt(0)}${author.nom.charAt(0)}`.toUpperCase();
                          }
                          return 'U';
                        })()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} component="span">
                          {author.fullName || `${author.prenom} ${author.nom}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" component="span">
                          {author.email}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAddAuthorDialogOpen(false)} disabled={assignmentLoading === 'add'}>
            Annuler
          </Button>
          <Button
            onClick={handleAddAuthor}
            variant="contained"
            disabled={!selectedAuthorId || assignmentLoading === 'add'}
          >
            {assignmentLoading === 'add' ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            Assigner
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
