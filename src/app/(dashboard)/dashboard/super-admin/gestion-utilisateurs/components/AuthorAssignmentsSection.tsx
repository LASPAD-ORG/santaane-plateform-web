'use client';

import {
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
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
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { User } from '../fetchers/useFetchGestionUtilisateurs';
import { useMentorApi, Mentor, MentorAssignment } from '../fetchers/useMentorApi';
import { useAlertStore } from '@/stores/alertStore';
import { useAssignmentValidation } from '@/hooks/useAssignmentValidation';

interface AuthorAssignmentsSectionProps {
  user: User;
  onAssignmentChange?: () => void;
}

export function AuthorAssignmentsSection({ user, onAssignmentChange }: AuthorAssignmentsSectionProps) {
  const [activeAssignment, setActiveAssignment] = useState<MentorAssignment | null>(null);
  const [availableMentors, setAvailableMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string>('');
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  
  const { fetchMentors, assignAuthorToMentor, updateAssignment, deleteAssignment, fetchAllAssignments } = useMentorApi();
  const { showSuccess, showError } = useAlertStore();
  const { validateAssignment } = useAssignmentValidation();

  // Charger l'assignation active de l'auteur
  const loadActiveAssignment = async () => {
    try {
      setLoading(true);
      
      // Récupérer toutes les assignations et filtrer pour cet auteur
      const allAssignments = await fetchAllAssignments();
      const authorAssignment = allAssignments.find(
        assignment => assignment.author_id === parseInt(user.id) && assignment.is_active
      );
      
      setActiveAssignment(authorAssignment || null);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'assignation active:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les mentors disponibles
  const loadAvailableMentors = async () => {
    try {
      const mentors = await fetchMentors();
      setAvailableMentors(mentors);
    } catch (error) {
      console.error('Erreur lors du chargement des mentors:', error);
    }
  };

  useEffect(() => {
    loadActiveAssignment();
    loadAvailableMentors();
  }, [user.id]);

  // Assigner l'auteur à un mentor
  const handleAssignMentor = async () => {
    if (!selectedMentorId) return;

    try {
      setAssignmentLoading(true);
      
      // Valider si l'auteur peut être assigné
      const validation = validateAssignment(parseInt(user.id));
      if (!validation.isValid) {
        showError('Assignation impossible', validation.message);
        return;
      }

      await assignAuthorToMentor({
        mentor_id: parseInt(selectedMentorId),
        author_id: parseInt(user.id),
      });

      showSuccess('Assignation réussie', `${user.prenom} ${user.nom} a été assigné au mentor avec succès`);
      setAssignDialogOpen(false);
      setSelectedMentorId('');
      // Recharger les données pour refléter les changements
      await loadActiveAssignment();
      onAssignmentChange?.();
    } catch (error: any) {
      console.error('Erreur lors de l\'assignation:', error);
      showError('Erreur', error.response?.data?.detail || 'Erreur lors de l\'assignation');
    } finally {
      setAssignmentLoading(false);
    }
  };

  // Activer/désactiver l'assignation
  const handleToggleAssignment = async () => {
    if (!activeAssignment) return;

    try {
      setAssignmentLoading(true);
      
      await updateAssignment(activeAssignment.id, {
        is_active: !activeAssignment.is_active,
      });

      showSuccess(
        'Assignation mise à jour',
        `L'assignation a été ${activeAssignment.is_active ? 'désactivée' : 'activée'}`
      );
      loadActiveAssignment();
      onAssignmentChange?.();
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de l\'assignation:', error);
      showError('Erreur', error.response?.data?.detail || 'Erreur lors de la mise à jour');
    } finally {
      setAssignmentLoading(false);
    }
  };

  // Supprimer l'assignation
  const handleDeleteAssignment = async () => {
    if (!activeAssignment) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette assignation ?')) return;

    try {
      setAssignmentLoading(true);
      
      await deleteAssignment(activeAssignment.id);

      showSuccess('Assignation supprimée', 'L\'assignation a été supprimée avec succès');
      // Recharger les données pour refléter les changements
      await loadActiveAssignment();
      onAssignmentChange?.();
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'assignation:', error);
      showError('Erreur', error.response?.data?.detail || 'Erreur lors de la suppression');
    } finally {
      setAssignmentLoading(false);
    }
  };

  const getUserInitials = () => {
    const first = user.prenom ? user.prenom.charAt(0) : '';
    const last = user.nom ? user.nom.charAt(0) : '';
    return `${first}${last}`.toUpperCase();
  };

  const getMentorInitials = (mentor: Mentor) => {
    const first = mentor.prenom ? mentor.prenom.charAt(0) : '';
    const last = mentor.nom ? mentor.nom.charAt(0) : '';
    return `${first}${last}`.toUpperCase();
  };

  const selectedMentor = availableMentors.find(m => m.id === selectedMentorId);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <GroupIcon />
        Assignation mentor
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : activeAssignment ? (
        // Afficher l'assignation active
        <Card sx={{ border: '1px solid', borderColor: 'success.main', bgcolor: 'success.50' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'success.dark' }}>
                Assignation active
              </Typography>
              <Chip
                label={activeAssignment.is_active ? 'Actif' : 'Inactif'}
                color={activeAssignment.is_active ? 'success' : 'default'}
                size="small"
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {getUserInitials()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }} component="span">
                  {user.prenom} {user.nom}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="span">
                  {user.email}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                est assigné à
              </Typography>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                {activeAssignment.mentor_id ? 'M' : '?'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }} component="span">
                  Mentor ID: {activeAssignment.mentor_id}
                </Typography>
                <Typography variant="caption" color="text.secondary" component="span">
                  Assigné le {new Date(activeAssignment.created_at).toLocaleDateString('fr-FR')}
                </Typography>
              </Box>
            </Box>
          </CardContent>
          
          <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteAssignment}
                disabled={assignmentLoading}
                size="small"
              >
                Supprimer
              </Button>
            </Box>
          </CardActions>
        </Card>
      ) : (
        // Aucune assignation active
        <Alert severity="info" sx={{ mb: 2 }}>
          Cet auteur n'est actuellement assigné à aucun mentor.
        </Alert>
      )}

      {!activeAssignment && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setAssignDialogOpen(true)}
            disabled={loading || assignmentLoading}
            fullWidth
          >
            Assigner à un mentor
          </Button>
        </Box>
      )}

      {/* Dialog pour assigner à un mentor */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PersonAddIcon sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant="h6">Assigner à un mentor</Typography>
              <Typography variant="body2" color="text.secondary">
                Assigner {user.prenom} {user.nom} à un mentor
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Informations de l'auteur */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
              Auteur à assigner
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                {getUserInitials()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }} component="span">
                  {user.prenom} {user.nom}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="span">
                  {user.email}
                </Typography>
                {user.laboratoire && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <BusinessIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary" component="span">
                      {user.laboratoire}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          <FormControl fullWidth required>
            <InputLabel>Sélectionner un mentor</InputLabel>
            <Select
              value={selectedMentorId}
              label="Sélectionner un mentor"
              onChange={(e) => setSelectedMentorId(e.target.value)}
              disabled={assignmentLoading}
            >
              {availableMentors.length === 0 ? (
                <MenuItem disabled>
                  <Typography color="text.secondary" component="span">Aucun mentor disponible</Typography>
                </MenuItem>
              ) : (
                availableMentors.map((mentor) => (
                  <MenuItem key={mentor.id} value={mentor.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.main' }}>
                        {getMentorInitials(mentor)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} component="span">
                          {mentor.prenom} {mentor.nom}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" component="span">
                          {mentor.email}
                        </Typography>
                        {mentor.laboratoire && (
                          <Typography variant="caption" color="text.secondary" component="span" sx={{ display: 'block' }}>
                            {mentor.laboratoire}
                          </Typography>
                        )}
                      </Box>
                      <Chip
                        label="MENTOR"
                        size="small"
                        sx={{
                          backgroundColor: '#388e3c20',
                          color: '#388e3c',
                          border: '1px solid #388e3c40',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* Aperçu du mentor sélectionné */}
          {selectedMentor && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 2, border: '1px solid', borderColor: 'success.200' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'success.dark' }}>
                Mentor sélectionné
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'success.main' }}>
                  {getMentorInitials(selectedMentor)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }} component="span">
                    {selectedMentor.prenom} {selectedMentor.nom}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="span">
                    {selectedMentor.email}
                  </Typography>
                  {selectedMentor.laboratoire && (
                    <Typography variant="caption" color="text.secondary" component="span">
                      {selectedMentor.laboratoire}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)} disabled={assignmentLoading}>
            Annuler
          </Button>
          <Button
            onClick={handleAssignMentor}
            variant="contained"
            disabled={!selectedMentorId || assignmentLoading}
          >
            {assignmentLoading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            Assigner
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
