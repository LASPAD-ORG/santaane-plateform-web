'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Comment as CommentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Help as HelpIcon,
  ThumbUp as ThumbUpIcon,
  Block as BlockIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon
} from '@mui/icons-material';
import type { CommentairePreSoumission, ManuscritAuteur } from '../fetchers/useFetchAuteurAAcompagner';

interface CommentairesPreSoumissionProps {
  manuscrit: ManuscritAuteur;
  onAddComment: (comment: Omit<CommentairePreSoumission, 'id' | 'dateCreation'>) => void;
  onUpdateComment: (commentId: string, updates: Partial<CommentairePreSoumission>) => void;
  onDeleteComment: (commentId: string) => void;
}

const SECTIONS = [
  { value: 'forme', label: '🏗️ Forme', description: 'Structure, organisation, mise en page' },
  { value: 'style', label: '✨ Style', description: 'Écriture, ton, fluidité narrative' },
  { value: 'methodologie', label: '🔬 Méthodologie', description: 'Recherche, sources, logique' },
  { value: 'contenu', label: '📖 Contenu', description: 'Personnages, intrigue, richesse' },
  { value: 'structure', label: '🏛️ Structure', description: 'Architecture narrative, transitions' },
  { value: 'general', label: '🎯 Général', description: 'Impression d\'ensemble, conseils globaux' }
];

const TYPES = [
  { value: 'suggestion', label: '💡 Suggestion', color: 'info', icon: ThumbUpIcon },
  { value: 'question', label: '❓ Question', color: 'warning', icon: HelpIcon },
  { value: 'validation', label: '✅ Validation', color: 'success', icon: CheckCircleIcon },
  { value: 'blocage', label: '🚫 Blocage', color: 'error', icon: BlockIcon }
];

const NIVEAUX_IMPORTANCE = [
  { value: 'info', label: 'Info', color: 'default' },
  { value: 'important', label: 'Important', color: 'warning' },
  { value: 'critique', label: 'Critique', color: 'error' }
];

export default function CommentairesPreSoumission({
  manuscrit,
  onAddComment,
  onUpdateComment,
  onDeleteComment
}: CommentairesPreSoumissionProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<{
    section: CommentairePreSoumission['section'];
    texte: string;
    type: CommentairePreSoumission['type'];
    mentorId: string;
    auteurId: string;
    manuscritId: string;
    statut: CommentairePreSoumission['statut'];
    metadata: {
      niveau_importance: 'info' | 'important' | 'critique';
      bloque_soumission: boolean;
    };
  }>({
    section: 'general',
    texte: '',
    type: 'suggestion',
    mentorId: 'mentor-1',
    auteurId: manuscrit.auteurId,
    manuscritId: manuscrit.id,
    statut: 'brouillon',
    metadata: {
      niveau_importance: 'info',
      bloque_soumission: false
    }
  });

  const commentaires = manuscrit.validation_mentor?.commentaires_pre_soumission || [];
  const commentairesParSection = commentaires.reduce((acc, comment) => {
    if (!acc[comment.section]) acc[comment.section] = [];
    acc[comment.section].push(comment);
    return acc;
  }, {} as Record<string, CommentairePreSoumission[]>);

  const handleAddComment = () => {
    const finalComment = {
      ...newComment,
      metadata: {
        ...newComment.metadata,
        bloque_soumission: newComment.metadata.niveau_importance === 'info'
      }
    };

    onAddComment(finalComment);
    setNewComment({
      section: 'general',
      texte: '',
      type: 'suggestion',
      mentorId: 'mentor-1',
      auteurId: manuscrit.auteurId,
      manuscritId: manuscrit.id,
      statut: 'brouillon',
      metadata: {
        niveau_importance: 'info',
        bloque_soumission: false
      }
    });
    setOpenDialog(false);
  };

  const getTypeInfo = (type: string) => {
    return TYPES.find(t => t.value === type) || TYPES[0];
  };

  const getImportanceColor = (niveau: string) => {
    const info = NIVEAUX_IMPORTANCE.find(n => n.value === niveau);
    return info?.color || 'default';
  };

  const totalCommentaires = commentaires.length;
  const commentairesBlocants = commentaires.filter(c =>
    c.metadata?.bloque_soumission || c.type === 'blocage'
  ).length;

  return (
    <Box>
      {/* En-tête avec statistiques */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CommentIcon color="primary" />
            Commentaires Pré-Soumission
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              icon={<CommentIcon />}
              label={`${totalCommentaires} commentaire${totalCommentaires > 1 ? 's' : ''}`}
              color="primary"
              variant="outlined"
            />
            {commentairesBlocants > 0 && (
              <Chip
                icon={<WarningIcon />}
                label={`${commentairesBlocants} bloquant${commentairesBlocants > 1 ? 's' : ''}`}
                color="error"
              />
            )}
          </Box>
        </Box>

        <Alert
          severity={commentairesBlocants > 0 ? "warning" : "info"}
          sx={{ mb: 2 }}
        >
          {commentairesBlocants > 0 ? (
            <>
              <strong>Attention :</strong> Ce manuscrit a {commentairesBlocants} commentaire(s) bloquant(s)
              qui empêchent la soumission officielle.
            </>
          ) : (
            <>
              <strong>Pré-révision :</strong> Vous pouvez laisser des commentaires constructifs
              pour aider l'auteur avant la soumission officielle.
            </>
          )}
        </Alert>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ mr: 2 }}
        >
          Ajouter un commentaire
        </Button>
      </Paper>

      {/* Liste des commentaires par section */}
      {SECTIONS.map(section => {
        const sectionComments = commentairesParSection[section.value] || [];
        if (sectionComments.length === 0) return null;

        return (
          <Paper key={section.value} sx={{ mb: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {section.label}
                <Badge badgeContent={sectionComments.length} color="primary">
                  <CommentIcon />
                </Badge>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {section.description}
              </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
              {sectionComments.map((comment, index) => {
                const typeInfo = getTypeInfo(comment.type);
                const TypeIcon = typeInfo.icon;

                return (
                  <Card key={comment.id} sx={{ mb: 2, border: comment.metadata?.bloque_soumission ? '2px solid' : '1px solid', borderColor: comment.metadata?.bloque_soumission ? 'error.main' : 'grey.300' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar sx={{ bgcolor: `${typeInfo.color}.main` }}>
                          <TypeIcon />
                        </Avatar>

                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip
                              label={typeInfo.label}
                              color={typeInfo.color as any}
                              size="small"
                            />

                            <Chip
                              label={NIVEAUX_IMPORTANCE.find(n => n.value === comment.metadata?.niveau_importance)?.label || 'Info'}
                              color={getImportanceColor(comment.metadata?.niveau_importance || 'info') as any}
                              size="small"
                              variant="outlined"
                            />

                            <Typography variant="caption" color="text.secondary">
                              {new Date(comment.dateCreation).toLocaleDateString('fr-FR')}
                            </Typography>
                          </Box>

                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {comment.texte}
                          </Typography>

                          {comment.metadata?.bloque_soumission && (
                            <Alert severity="error">
                              ⚠️ Ce commentaire bloque la soumission du manuscrit
                            </Alert>
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Modifier">
                            <IconButton size="small" onClick={() => setEditingComment(comment.id)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton size="small" color="error" onClick={() => onDeleteComment(comment.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Paper>
        );
      })}

      {/* Message si aucun commentaire */}
      {totalCommentaires === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CommentIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun commentaire pré-soumission
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Commencez par ajouter des commentaires constructifs pour aider l'auteur
            à améliorer son manuscrit avant la soumission officielle.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
            Ajouter le premier commentaire
          </Button>
        </Paper>
      )}

      {/* Dialog d'ajout de commentaire */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddIcon />
          Nouveau commentaire pré-soumission
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Section</InputLabel>
              <Select
                value={newComment.section}
                label="Section"
                onChange={(e) => setNewComment(prev => ({ ...prev, section: e.target.value as any }))}
              >
                {SECTIONS.map(section => (
                  <MenuItem key={section.value} value={section.value}>
                    <Box>
                      <Typography variant="body1">{section.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {section.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Type de commentaire</InputLabel>
              <Select
                value={newComment.type}
                label="Type de commentaire"
                onChange={(e) => setNewComment(prev => ({ ...prev, type: e.target.value as any }))}
              >
                {TYPES.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <type.icon />
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Niveau d'importance</InputLabel>
              <Select
                value={newComment.metadata.niveau_importance}
                label="Niveau d'importance"
                onChange={(e) => setNewComment(prev => ({
                  ...prev,
                  metadata: { ...prev.metadata, niveau_importance: e.target.value as any }
                }))}
              >
                {NIVEAUX_IMPORTANCE.map(niveau => (
                  <MenuItem key={niveau.value} value={niveau.value}>
                    <Chip label={niveau.label} color={niveau.color as any} size="small" />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Votre commentaire"
              value={newComment.texte}
              onChange={(e) => setNewComment(prev => ({ ...prev, texte: e.target.value }))}
              placeholder="Rédigez votre commentaire constructif..."
              helperText="Soyez précis et bienveillant. Votre rôle est d'aider l'auteur à s'améliorer."
            />

            {(newComment.type === 'blocage' || newComment.metadata.niveau_importance === 'critique') && (
              <Alert severity="warning">
                ⚠️ Ce commentaire bloquera la soumission du manuscrit jusqu'à résolution
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Annuler
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleAddComment}
            disabled={!newComment.texte.trim()}
          >
            Envoyer le commentaire
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}