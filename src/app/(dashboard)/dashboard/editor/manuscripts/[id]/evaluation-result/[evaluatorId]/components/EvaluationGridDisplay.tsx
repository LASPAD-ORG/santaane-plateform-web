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
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight="600">
            Grille d'Évaluation
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Stack spacing={3}>
          {/* En-tête simple */}
          <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 1, mt: 2 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Article
                </Typography>
                <Typography variant="h6" fontWeight="500">
                  {grid.articleTitle}
                </Typography>
              </Box>
              
              <Stack direction="row" spacing={4}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Évaluateur
                  </Typography>
                  <Typography variant="body1">
                    SLSP{grid.evaluatorId}
                  </Typography>
                </Box>
                
                {grid.submittedAt && (
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      Évaluation soumise le
                    </Typography>
                    <Typography variant="body1">
                      {new Date(grid.submittedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Typography>
                  </Box>
                )}
              </Stack>

              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Recommandation finale
                </Typography>
                <Chip
                  icon={recommendationInfo.icon}
                  label={recommendationInfo.label}
                  color={recommendationInfo.color}
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            </Stack>
          </Paper>

          {/* Critères d'évaluation simples */}
          <Box>
            <Typography variant="h6" fontWeight="600" color="text.primary" sx={{ mb: 3 }}>
              Critères d'Évaluation
            </Typography>

            <Stack spacing={2}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle1" fontWeight="500" color="primary.main" gutterBottom>
                  Originalité et pertinence des idées
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {grid.originalityOfIdeas}
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle1" fontWeight="500" color="primary.main" gutterBottom>
                  Méthode et rigueur scientifique
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {grid.methodologyRigor}
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle1" fontWeight="500" color="primary.main" gutterBottom>
                  Approche théorique et empirique
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {grid.theoreticalApproach}
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle1" fontWeight="500" color="primary.main" gutterBottom>
                  Présentation et clarté
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {grid.presentationClarity}
                </Typography>
              </Paper>
            </Stack>
          </Box>

          {/* Synthèse simple et claire */}
          <Box>
            <Typography variant="h6" fontWeight="600" color="text.primary" sx={{ mb: 3 }}>
              Synthèse de l'Évaluation
            </Typography>

            <Stack spacing={2}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'success.light',
                  borderRadius: 1,
                  bgcolor: 'success.50'
                }}
              >
                <Typography variant="subtitle1" color="success.dark" fontWeight="600" gutterBottom>
                  Points forts
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {grid.strengths}
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'error.light',
                  borderRadius: 1,
                  bgcolor: 'error.50'
                }}
              >
                <Typography variant="subtitle1" color="error.dark" fontWeight="600" gutterBottom>
                  Points faibles
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {grid.weaknesses}
                </Typography>
              </Paper>

              {grid.suggestions && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: '1px solid',
                    borderColor: 'info.light',
                    borderRadius: 1,
                    bgcolor: 'info.50'
                  }}
                >
                  <Typography variant="subtitle1" color="info.dark" fontWeight="600" gutterBottom>
                    Suggestions d'amélioration
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {grid.suggestions}
                  </Typography>
                </Paper>
              )}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} variant="contained">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
