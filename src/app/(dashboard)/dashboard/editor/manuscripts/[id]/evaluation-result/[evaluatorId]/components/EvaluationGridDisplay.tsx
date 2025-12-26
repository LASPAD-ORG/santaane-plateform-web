'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Paper,
  Typography,
  Stack,
  IconButton,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Cancel,
  Info,
  ThumbUp,
  ThumbDown,
  Lightbulb,
} from '@mui/icons-material';
import type { EvaluationGrid } from '@/types/evaluationGrid';

interface EvaluationGridDisplayProps {
  open: boolean;
  onClose: () => void;
  grid: EvaluationGrid;
}

const recommendationConfig = {
  accepted_with_validation: {
    label: 'Accepté sous réserve de validation',
    color: 'success' as const,
    icon: <CheckCircle />,
  },
  resubmission_required: {
    label: 'Soumission d\'une nouvelle version',
    color: 'warning' as const,
    icon: <Info />,
  },
  rejected: {
    label: 'Refusé',
    color: 'error' as const,
    icon: <Cancel />,
  },
};

export function EvaluationGridDisplay({ open, onClose, grid }: EvaluationGridDisplayProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const recommendationInfo = recommendationConfig[grid.recommendation];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      scroll="paper"
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight="bold">
            Grille d'Évaluation
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* En-tête */}
          <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Article
                </Typography>
                <Typography variant="h6">{grid.articleTitle}</Typography>
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Évaluateur
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {grid.evaluatorName}
                </Typography>
              </Box>
              {grid.submittedAt && (
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Soumis le
                  </Typography>
                  <Typography variant="body2">
                    {new Date(grid.submittedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>

          {/* Avis Final */}
          <Box>
            <Typography variant="overline" color="text.secondary" gutterBottom>
              Avis Final
            </Typography>
            <Chip
              icon={recommendationInfo.icon}
              label={recommendationInfo.label}
              color={recommendationInfo.color}
              size="large"
              sx={{ fontSize: '1rem', py: 3, px: 2 }}
            />
          </Box>

          <Divider />

          {/* Critères d'évaluation */}
          <Typography variant="h6" fontWeight="bold">
            Critères d'Évaluation
          </Typography>

          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Originalité et pertinence des idées
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {grid.originalityOfIdeas}
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Pertinence et rigueur de la méthode, de la démarche et des références
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {grid.methodologyRigor}
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Recours à des études empiriques et une approche théorique solide
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {grid.theoreticalApproach}
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Soin dans la présentation et la structure du texte, clarté de l'expression
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {grid.presentationClarity}
            </Typography>
          </Paper>

          <Divider />

          {/* Points forts et faibles */}
          <Typography variant="h6" fontWeight="bold">
            Synthèse
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderColor: 'success.light',
              bgcolor: 'rgba(46, 125, 50, 0.08)',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <ThumbUp color="success" fontSize="small" />
              <Typography variant="subtitle2" color="success.dark" fontWeight="bold">
                Points forts
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {grid.strengths}
            </Typography>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderColor: 'error.light',
              bgcolor: 'rgba(211, 47, 47, 0.08)',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <ThumbDown color="error" fontSize="small" />
              <Typography variant="subtitle2" color="error.dark" fontWeight="bold">
                Points faibles
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {grid.weaknesses}
            </Typography>
          </Paper>

          {grid.suggestions && (
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderColor: 'info.light',
                bgcolor: 'rgba(2, 136, 209, 0.08)',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Lightbulb color="info" fontSize="small" />
                <Typography variant="subtitle2" color="info.dark" fontWeight="bold">
                  Suggestions pour améliorer le texte
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {grid.suggestions}
              </Typography>
            </Paper>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
