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
} from '@mui/icons-material';
import { Evaluator } from '@/types/manuscript';

interface EvaluatorHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  manuscriptTitle: string;
  evaluators: Evaluator[];
}

export default function EvaluatorHistoryDialog({
  open,
  onClose,
  manuscriptTitle,
  evaluators,
}: EvaluatorHistoryDialogProps) {
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
                        <Chip
                          label={getStatusLabel(evaluator.status)}
                          color={getStatusColor(evaluator.status) as any}
                          size="small"
                          icon={getStatusIcon(evaluator.status)}
                        />
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
