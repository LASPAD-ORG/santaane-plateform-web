'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import {
  CalendarToday,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Schedule,
  PictureAsPdf,
  PlayCircle,
  PauseCircle,
  TaskAlt,
} from '@mui/icons-material';
import { EvaluatorManuscript } from '@/types/evaluator';
import { useState } from 'react';
import axios from 'axios';
import { useAlertStore } from '@/stores/alertStore';
import { useRouter } from 'next/navigation';

interface EvaluatorManuscriptCardProps {
  manuscript: EvaluatorManuscript;
  onUpdate: () => void;
}

export default function EvaluatorManuscriptCard({
  manuscript,
  onUpdate,
}: EvaluatorManuscriptCardProps) {
  const router = useRouter();
  const { showSuccess, showError } = useAlertStore();
  const [responding, setResponding] = useState(false);

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

  const getStatusColor = () => {
    switch (manuscript.assignmentStatus) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'declined':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = () => {
    switch (manuscript.assignmentStatus) {
      case 'pending':
        return 'En attente de réponse';
      case 'accepted':
        return 'Accepté';
      case 'declined':
        return 'Refusé';
      default:
        return manuscript.assignmentStatus;
    }
  };

  const getStatusIcon = () => {
    switch (manuscript.assignmentStatus) {
      case 'pending':
        return <HourglassEmpty fontSize="small" />;
      case 'accepted':
        return <CheckCircle fontSize="small" />;
      case 'declined':
        return <Cancel fontSize="small" />;
      default:
        return null;
    }
  };

  const getEvaluationStatusLabel = () => {
    if (manuscript.assignmentStatus !== 'accepted') return null;
    
    switch (manuscript.evaluationStatus) {
      case 'completed':
        return 'Terminé';
      case 'in_progress':
      case 'not_started':
      default:
        return 'En cours';
    }
  };

  const getEvaluationStatusColor = () => {
    switch (manuscript.evaluationStatus) {
      case 'completed':
        return 'success';
      case 'in_progress':
      case 'not_started':
      default:
        return 'warning';
    }
  };

  const getEvaluationStatusIcon = () => {
    switch (manuscript.evaluationStatus) {
      case 'not_started':
        return <PlayCircle fontSize="small" />;
      case 'in_progress':
        return <PauseCircle fontSize="small" />;
      case 'completed':
        return <TaskAlt fontSize="small" />;
      default:
        return <PlayCircle fontSize="small" />;
    }
  };

  const handleResponse = async (accept: boolean) => {
    setResponding(true);
    try {
      await axios.put(`/api/evaluator/manuscripts/${manuscript.id}/response`, {
        accept,
      });

      showSuccess(
        accept
          ? 'Évaluation acceptée avec succès'
          : 'Évaluation refusée avec succès'
      );
      onUpdate();
    } catch (error) {
      console.error('Erreur lors de la réponse:', error);
      showError('Erreur lors de la réponse à l\'assignation');
    } finally {
      setResponding(false);
    }
  };

  const isDeadlinePassed = () => {
    if (!manuscript.evaluationDeadline) return false;
    return new Date(manuscript.evaluationDeadline) < new Date();
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Stack direction="row" spacing={1}>
            <Chip
              label={getStatusLabel()}
              color={getStatusColor() as any}
              size="small"
              icon={getStatusIcon() || undefined}
            />
            {manuscript.assignmentStatus === 'accepted' && getEvaluationStatusLabel() && (
              <Chip
                label={getEvaluationStatusLabel()}
                color={getEvaluationStatusColor() as any}
                size="small"
                icon={getEvaluationStatusIcon() || undefined}
                variant="outlined"
              />
            )}
          </Stack>
          {manuscript.evaluationDeadline && (
            <Chip
              label={`Échéance: ${formatDate(manuscript.evaluationDeadline)}`}
              size="small"
              icon={<Schedule fontSize="small" />}
              color={isDeadlinePassed() ? 'error' : 'default'}
              variant="outlined"
            />
          )}
        </Box>

        {/* Titre */}
        <Typography
          variant="h6"
          fontWeight="600"
          mb={1}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {manuscript.title}
        </Typography>

        {/* Résumé */}
        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            flex: 1,
          }}
        >
          {manuscript.abstract}
        </Typography>

        {/* Métadonnées */}
        <Box display="flex" flexDirection="column" gap={1} mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="caption" color="text.secondary">
              Appel:
            </Typography>
            <Typography variant="caption" fontWeight="500">
              {manuscript.themeName}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="caption" color="text.secondary">
              Rubrique:
            </Typography>
            <Typography variant="caption" fontWeight="500">
              {manuscript.sectionName}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="caption" color="text.secondary">
              Langue:
            </Typography>
            <Typography variant="caption" fontWeight="500">
              {manuscript.languageName}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Footer avec dates et actions */}
        <Box>
          <Box display="flex" alignItems="center" gap={0.5} mb={2}>
            <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Assigné le {formatDate(manuscript.assignedAt)}
            </Typography>
          </Box>

          {/* Afficher la date de réponse si déjà répondu */}
          {manuscript.responseAt && (
            <Box display="flex" alignItems="center" gap={0.5} mb={2}>
              <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Répondu le {formatDate(manuscript.responseAt)}
              </Typography>
            </Box>
          )}

          {/* Afficher la date de soumission de l'évaluation si terminée */}
          {manuscript.evaluationStatus === 'completed' && manuscript.evaluationSubmittedAt && (
            <Box display="flex" alignItems="center" gap={0.5} mb={2}>
              <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Évaluation soumise le {formatDate(manuscript.evaluationSubmittedAt)}
              </Typography>
            </Box>
          )}

          {/* Boutons d'action pour les manuscrits en attente */}
          {manuscript.assignmentStatus === 'pending' && (
            <Stack direction="column" spacing={1}>
              {/* Bouton pour consulter le manuscrit (lecture seule) */}
              <Button
                variant="outlined"
                color="primary"
                size="small"
                fullWidth
                startIcon={<PictureAsPdf />}
                onClick={() => router.push(`/dashboard/evaluator/manuscripts/${manuscript.id}/view`)}
              >
                Consulter le manuscrit
              </Button>
              
              {/* Boutons Accepter/Refuser */}
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  fullWidth
                  startIcon={<CheckCircle />}
                  onClick={() => handleResponse(true)}
                  disabled={responding}
                >
                  Accepter d'évaluer
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  fullWidth
                  startIcon={<Cancel />}
                  onClick={() => handleResponse(false)}
                  disabled={responding}
                >
                  Refuser d'évaluer
                </Button>
              </Stack>
            </Stack>
          )}

          {/* Actions disponibles uniquement pour les manuscrits acceptés et non terminés */}
          {manuscript.assignmentStatus === 'accepted' && manuscript.evaluationStatus !== 'completed' && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              fullWidth
              onClick={() => router.push(`/dashboard/evaluator/manuscripts/${manuscript.id}/evaluate`)}
            >
              Évaluer
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
