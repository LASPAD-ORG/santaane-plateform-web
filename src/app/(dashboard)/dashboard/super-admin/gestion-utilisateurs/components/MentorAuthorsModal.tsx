'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  RemoveCircle as RemoveCircleIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useMentorApi, Author } from '../fetchers/useMentorApi';
import { User } from '../fetchers/useFetchGestionUtilisateurs';
import { useAlertStore } from '@/stores/alertStore';
import { ROLE_CONFIGS } from '@/config/roles';

interface MentorAuthorsModalProps {
  open: boolean;
  onClose: () => void;
  mentor: User;
  onAssignmentRemoved?: () => void;
}

export function MentorAuthorsModal({
  open,
  onClose,
  mentor,
  onAssignmentRemoved,
}: MentorAuthorsModalProps) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [removingAuthorId, setRemovingAuthorId] = useState<string | null>(null);
  
  const { fetchMentorAuthors, deleteAssignment, fetchAllAssignments, error, clearError } = useMentorApi();
  const { showSuccess, showError, showConfirm } = useAlertStore();

  // Charger les auteurs assignés au mentor au montage du modal
  useEffect(() => {
    if (open) {
      loadMentorAuthors();
    }
  }, [open, mentor.id]);

  const loadMentorAuthors = async () => {
    try {
      setLoading(true);
      clearError();
      const authorsData = await fetchMentorAuthors(mentor.id);
      setAuthors(authorsData);
    } catch (error) {
      console.error('Erreur lors du chargement des auteurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAssignment = async (authorId: string) => {
    const author = authors.find(a => a.id === authorId);
    if (!author) return;

    showConfirm(
      'Retirer l\'assignation',
      `Êtes-vous sûr de vouloir retirer ${author.prenom} ${author.nom} du mentor ${mentor.prenom} ${mentor.nom} ?`,
      async () => {
        try {
          setRemovingAuthorId(authorId);
          clearError();

          // Récupérer toutes les assignations pour trouver celle à supprimer
          const allAssignments = await fetchAllAssignments();
          const assignmentToDelete = allAssignments.find(
            assignment => assignment.mentor_id === parseInt(mentor.id) && assignment.author_id === parseInt(authorId)
          );

          if (assignmentToDelete) {
            await deleteAssignment(assignmentToDelete.id);
            
            showSuccess('Assignation retirée', `${author.prenom} ${author.nom} n\'est plus assigné à ${mentor.prenom} ${mentor.nom}`);
            
            // Mettre à jour la liste locale
            setAuthors(prev => prev.filter(a => a.id !== authorId));
            
            if (onAssignmentRemoved) {
              onAssignmentRemoved();
            }
          } else {
            showError('Erreur', 'Assignation non trouvée');
          }
        } catch (error) {
          console.error('Erreur lors du retrait de l\'assignation:', error);
        } finally {
          setRemovingAuthorId(null);
        }
      }
    );
  };

  const handleClose = () => {
    setAuthors([]);
    clearError();
    onClose();
  };

  // Fonction pour obtenir les initiales
  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return '??';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Obtenir la couleur du rôle
  const getRoleColor = (role: string) => {
    return (ROLE_CONFIGS as any)[role]?.color || '#757575';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SchoolIcon sx={{ color: 'success.main', fontSize: 28 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              Auteurs assignés
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Liste des auteurs accompagnés par {mentor.prenom} {mentor.nom}
            </Typography>
          </Box>
          <Chip
            label={`${authors.length} auteur${authors.length > 1 ? 's' : ''}`}
            color="success"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        {/* Informations du mentor */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'success.50', borderRadius: 2, border: '1px solid', borderColor: 'success.200' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'success.dark' }}>
            Mentor
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{ width: 48, height: 48, bgcolor: 'success.main' }}
            >
              {getInitials(mentor.prenom, mentor.nom)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {mentor.prenom} {mentor.nom}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mentor.email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                {mentor.roles.map((role) => (
                  <Chip
                    key={role}
                    label={role}
                    size="small"
                    sx={{
                      backgroundColor: `${getRoleColor(role)}20`,
                      color: getRoleColor(role),
                      border: `1px solid ${getRoleColor(role)}40`,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                ))}
              </Box>
              {mentor.laboratoire && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                  <BusinessIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {mentor.laboratoire}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Liste des auteurs */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            Auteurs assignés
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : authors.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50', borderRadius: 2 }}>
              <PersonIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Aucun auteur assigné
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Ce mentor n'a actuellement aucun auteur assigné.
              </Typography>
            </Box>
          ) : (
            <List sx={{ bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              {authors.map((author, index) => (
                <Box key={author.id}>
                  <ListItem
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'bgcolor 0.2s',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}
                      >
                        {getInitials(author.prenom, author.nom)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {author.prenom && author.nom ? `${author.prenom} ${author.nom}` : 'Auteur inconnu'}
                            </Typography>
                            <Chip
                              label="AUTHOR"
                              size="small"
                              sx={{
                                backgroundColor: '#f57c0020',
                                color: '#f57c00',
                                border: '1px solid #f57c0040',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" component="span">
                              {author.email || 'Email non disponible'}
                            </Typography>
                          </Box>
                          {author.telephone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary" component="span">
                                {author.telephone}
                              </Typography>
                            </Box>
                          )}
                          {author.laboratoire && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BusinessIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary" component="span">
                                {author.laboratoire}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                    <Tooltip title="Retirer l'assignation">
                      <IconButton
                        onClick={() => handleRemoveAssignment(author.id)}
                        disabled={removingAuthorId === author.id}
                        color="error"
                        sx={{
                          '&:hover': {
                            bgcolor: 'error.light',
                            color: 'error.dark',
                          },
                        }}
                      >
                        {removingAuthorId === author.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <RemoveCircleIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                  {index < authors.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </Box>

        {/* Message d'erreur */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={loading || removingAuthorId !== null}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
