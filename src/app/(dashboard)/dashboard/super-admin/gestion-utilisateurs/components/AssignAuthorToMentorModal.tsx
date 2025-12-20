'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useMentorApi, Mentor, CreateAssignmentData } from '../fetchers/useMentorApi';
import { User } from '../fetchers/useFetchGestionUtilisateurs';
import { useAlertStore } from '@/stores/alertStore';
import { useAssignmentValidation } from '@/hooks/useAssignmentValidation';

interface AssignAuthorToMentorModalProps {
  open: boolean;
  onClose: () => void;
  author: User;
  onAssignmentSuccess: () => void;
}

export function AssignAuthorToMentorModal({
  open,
  onClose,
  author,
  onAssignmentSuccess,
}: AssignAuthorToMentorModalProps) {
  const [selectedMentorId, setSelectedMentorId] = useState<string>('');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  
  const { fetchMentors, assignAuthorToMentor, error, clearError } = useMentorApi();
  const { showSuccess, showError } = useAlertStore();
  const { validateAssignment, loading: validationLoading } = useAssignmentValidation();

  // Valider si l'auteur peut être assigné
  const validation = validateAssignment(parseInt(author.id));
  const isAssignmentDisabled = !validation.isValid;

  // Charger la liste des mentors au montage du modal
  useEffect(() => {
    if (open) {
      loadMentors();
    }
  }, [open]);

  const loadMentors = async () => {
    try {
      setInitialLoading(true);
      clearError();
      const mentorsData = await fetchMentors();
      setMentors(mentorsData);
    } catch (error) {
      console.error('Erreur lors du chargement des mentors:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMentorId) {
      showError('Erreur', 'Veuillez sélectionner un mentor');
      return;
    }

    // Validation avant l'appel API
    if (isAssignmentDisabled) {
      showError('Assignation impossible', validation.message);
      return;
    }

    try {
      setLoading(true);
      clearError();

      const assignmentData: CreateAssignmentData = {
        mentor_id: parseInt(selectedMentorId),
        author_id: parseInt(author.id),
      };

      await assignAuthorToMentor(assignmentData);
      
      showSuccess('Assignation réussie', `${author.prenom} ${author.nom} a été assigné au mentor avec succès`);
      onAssignmentSuccess();
      handleClose();
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedMentorId('');
    clearError();
    onClose();
  };

  const selectedMentor = mentors.find(m => m.id === selectedMentorId);

  // Fonction pour obtenir les initiales
  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName && firstName.charAt(0) ? firstName.charAt(0) : '';
    const last = lastName && lastName.charAt(0) ? lastName.charAt(0) : '';
    return `${first}${last}`.toUpperCase();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SchoolIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              Assigner à un mentor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Assigner {author.prenom} {author.nom} à un mentor pour l'accompagner
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        {/* Informations de l'auteur */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
            Auteur à assigner
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}
            >
              {getInitials(author.prenom, author.nom)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {author.prenom} {author.nom}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {author.email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                {author.roles.map((role) => (
                  <Chip
                    key={role}
                    label={role}
                    size="small"
                    sx={{
                      backgroundColor: '#f57c0020',
                      color: '#f57c00',
                      border: '1px solid #f57c0040',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Message d'avertissement si l'auteur a déjà un mentor actif */}
        {isAssignmentDisabled && (
          <Alert 
            severity="warning" 
            sx={{ mt: 2, mb: 2 }}
            action={
              validation.activeAssignment && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="warning.dark">
                    Mentor ID: {validation.activeAssignment.mentor_id}
                  </Typography>
                </Box>
              )
            }
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Assignation non possible
            </Typography>
            {validation.message}
          </Alert>
        )}

        {/* Sélection du mentor */}
        <FormControl fullWidth required disabled={isAssignmentDisabled}>
          <InputLabel id="mentor-select-label">Sélectionner un mentor</InputLabel>
          <Select
            labelId="mentor-select-label"
            value={selectedMentorId}
            label="Sélectionner un mentor"
            onChange={(e) => setSelectedMentorId(e.target.value)}
            disabled={initialLoading || loading}
            startAdornment={
              initialLoading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null
            }
          >
            {initialLoading ? (
              <MenuItem disabled>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography>Chargement des mentors...</Typography>
                </Box>
              </MenuItem>
            ) : mentors.length === 0 ? (
              <MenuItem disabled>
                <Typography color="text.secondary">Aucun mentor disponible</Typography>
              </MenuItem>
            ) : (
              mentors.map((mentor) => (
                <MenuItem key={mentor.id} value={mentor.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: 'success.main' }}
                    >
                      {getInitials(mentor.prenom, mentor.nom)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {mentor.prenom} {mentor.nom}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {mentor.email}
                      </Typography>
                      {mentor.laboratoire && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <BusinessIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {mentor.laboratoire}
                          </Typography>
                        </Box>
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
                        fontSize: '0.75rem',
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
              <Avatar
                sx={{ width: 40, height: 40, bgcolor: 'success.main' }}
              >
                {getInitials(selectedMentor.prenom, selectedMentor.nom)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {selectedMentor.prenom} {selectedMentor.nom}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedMentor.email}
                </Typography>
                {selectedMentor.laboratoire && (
                  <Typography variant="caption" color="text.secondary">
                    {selectedMentor.laboratoire}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}

        {/* Message d'erreur */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Tooltip 
          title={isAssignmentDisabled ? validation.message : ''} 
          placement="top"
          arrow
        >
          <span>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!selectedMentorId || loading || initialLoading || isAssignmentDisabled || validationLoading}
              startIcon={loading ? <CircularProgress size={16} /> : <PersonIcon />}
            >
              {loading ? 'Assignation...' : 'Assigner'}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
