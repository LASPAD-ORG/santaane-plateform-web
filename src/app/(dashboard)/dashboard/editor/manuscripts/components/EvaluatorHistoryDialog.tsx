'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  Paper,
  List,
  ListItem,
  Avatar,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  PersonAdd,
  HourglassEmpty,
  ThumbUp,
  ThumbDown,
  CheckCircleOutline,
  AccessTime,
  Event,
  Visibility,
  Send,
} from '@mui/icons-material';
import { Evaluator } from '@/types/manuscript';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAlertStore } from '@/stores/alertStore';

interface EvaluatorHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  manuscriptTitle: string;
  manuscriptId: number;
  evaluators: Evaluator[];
}

export default function EvaluatorHistoryDialog({
  open,
  onClose,
  manuscriptTitle,
  manuscriptId,
  evaluators,
}: EvaluatorHistoryDialogProps) {
  const router = useRouter();
  const { showSuccess, showError } = useAlertStore();
  const [sendingReminder, setSendingReminder] = useState<number | null>(null);

  const handleSendReminder = async (evaluatorId: number, evaluatorName: string) => {
    try {
      setSendingReminder(evaluatorId);

      const response = await axios.post(
        `/api/manuscripts/${manuscriptId}/evaluator/${evaluatorId}/send-reminder`
      );

      showSuccess(`Mail de relance envoyé avec succès à ${evaluatorName}`);
    } catch (error) {
      console.error('Error sending reminder:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Erreur lors de l\'envoi du mail de relance';
        showError(errorMessage);
      } else {
        showError('Erreur lors de l\'envoi du mail de relance');
      }
    } finally {
      setSendingReminder(null);
    }
  };

  // Calculer le statut global d'évaluation basé sur les évaluateurs individuels
  const calculateGlobalEvaluationStatus = () => {
    if (!evaluators || evaluators.length === 0) {
      return 'not_started';
    }
    
    const acceptedEvaluators = evaluators.filter(e => e.status === 'accepted');
    if (acceptedEvaluators.length === 0) {
      return 'not_started';
    }
    
    const completedEvaluations = acceptedEvaluators.filter(e => e.evaluationStatus === 'completed');
    
    if (completedEvaluations.length === acceptedEvaluators.length) {
      return 'completed';
    } else {
      return 'in_progress'; // Toutes les autres situations = en cours
    }
  };

  const globalEvaluationStatus = calculateGlobalEvaluationStatus();

  const getGlobalEvaluationStatusBadge = () => {
    switch (globalEvaluationStatus) {
      case 'completed':
        return (
          <Chip
            label="Toutes les évaluations sont terminées"
            color="success"
            size="small"
            icon={<CheckCircleOutline />}
          />
        );
      case 'in_progress':
        return (
          <Chip
            label="Évaluations en cours"
            color="primary"
            size="small"
            icon={<HourglassEmpty />}
          />
        );
      case 'not_started':
        return (
          <Chip
            label="Aucune évaluation commencée"
            color="default"
            size="small"
            icon={<PersonAdd />}
          />
        );
      default:
        return null;
    }
  };

  const getIndividualEvaluationStatusBadge = (evaluationStatus: string) => {
    switch (evaluationStatus) {
      case 'completed':
        return (
          <Chip
            label="Évaluation terminée"
            color="success"
            size="small"
            variant="outlined"
          />
        );
      case 'in_progress':
      case 'not_started':
      default:
        return (
          <Chip
            label="Évaluation en cours"
            color="primary"
            size="small"
            variant="outlined"
          />
        );
    }
  };
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'info';
      case 'rejected': return 'error';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <HourglassEmpty />;
      case 'accepted': return <ThumbUp />;
      case 'rejected': return <ThumbDown />;
      case 'completed': return <CheckCircleOutline />;
      default: return <PersonAdd />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente de réponse';
      case 'accepted': return 'Évaluation acceptée';
      case 'rejected': return 'Évaluation refusée';
      case 'completed': return 'Évaluation terminée';
      default: return 'Statut inconnu';
    }
  };

  // Trier les évaluateurs par date d'affectation (plus récent d'abord)
  const sortedEvaluators = [...evaluators].sort((a, b) => 
    new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      onClick={(e) => e.stopPropagation()}
      PaperProps={{
        sx: { minHeight: '400px' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" fontWeight="600">
              Historique des Évaluateurs
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {manuscriptTitle}
            </Typography>
            {/* Badge de statut global d'évaluation */}
            <Box mt={1}>
              {getGlobalEvaluationStatusBadge()}
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {sortedEvaluators.length === 0 ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              bgcolor: 'background.default',
              borderRadius: 2,
            }}
          >
            <PersonAdd sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucun évaluateur assigné
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ce manuscrit n'a pas encore été assigné à un évaluateur
            </Typography>
          </Paper>
        ) : (
          <List sx={{ px: 0 }}>
            {sortedEvaluators.map((evaluator, index) => (
              <Box key={evaluator.evaluatorId}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: 0,
                    py: 2,
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <Box display="flex" gap={2} width="100%">
                    {/* Avatar avec icône de statut */}
                    <Avatar
                      sx={{
                        bgcolor: `${getStatusColor(evaluator.status)}.main`,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {getStatusIcon(evaluator.status)}
                    </Avatar>

                    {/* Contenu principal */}
                    <Paper elevation={2} sx={{ p: 2.5, flex: 1 }}>
                      {/* En-tête avec nom et statut */}
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="600">
                            {evaluator.evaluatorName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {evaluator.evaluatorEmail}
                          </Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" gap={1} alignItems="end">
                          <Chip
                            label={getStatusLabel(evaluator.status)}
                            color={getStatusColor(evaluator.status) as any}
                            size="small"
                            icon={getStatusIcon(evaluator.status)}
                          />
                          {/* Badge de statut d'évaluation individuel */}
                          {evaluator.status === 'accepted' && evaluator.evaluationStatus && 
                            getIndividualEvaluationStatusBadge(evaluator.evaluationStatus)
                          }
                        </Box>
                      </Box>

                      {/* Détails de l'affectation */}
                      <Stack spacing={1.5}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PersonAdd fontSize="small" sx={{ color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Assigné le:
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {formatDateTime(evaluator.assignedAt)}
                          </Typography>
                        </Box>

                        {evaluator.evaluationDeadline && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Event fontSize="small" sx={{ color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              Date limite:
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {formatDate(evaluator.evaluationDeadline)}
                            </Typography>
                          </Box>
                        )}

                        {evaluator.responseAt && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <AccessTime fontSize="small" sx={{ color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              Réponse le:
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {formatDateTime(evaluator.responseAt)}
                            </Typography>
                          </Box>
                        )}
                      </Stack>

                      {/* Bouton de relance pour les évaluateurs en attente */}
                      {evaluator.status === 'pending' && (
                        <Box mt={2} display="flex" justifyContent="flex-end">
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={sendingReminder === evaluator.evaluatorId ? <CircularProgress size={16} color="inherit" /> : <Send />}
                            onClick={() => handleSendReminder(evaluator.evaluatorId, evaluator.evaluatorName)}
                            disabled={sendingReminder === evaluator.evaluatorId}
                            sx={{
                              textTransform: 'none',
                              backgroundColor: 'warning.main',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'warning.dark',
                              },
                              '&:disabled': {
                                backgroundColor: 'warning.light',
                                color: 'white',
                              }
                            }}
                          >
                            {sendingReminder === evaluator.evaluatorId ? 'Envoi en cours...' : 'Envoyer un mail de relance'}
                          </Button>
                        </Box>
                      )}

                      {/* Bouton de consultation pour les évaluations terminées */}
                      {evaluator.status === 'accepted' && evaluator.evaluationStatus === 'completed' && (
                        <Box mt={2} display="flex" justifyContent="flex-end">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => {
                              router.push(`/dashboard/editor/manuscripts/${manuscriptId}/evaluation-result/${evaluator.evaluatorId}`);
                            }}
                            sx={{
                              textTransform: 'none',
                              borderColor: 'primary.main',
                              color: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'primary.50',
                                borderColor: 'primary.dark',
                              }
                            }}
                          >
                            Consulter le résultat
                          </Button>
                        </Box>
                      )}
                    </Paper>
                  </Box>
                </ListItem>
                {index < sortedEvaluators.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}
