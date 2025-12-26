'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  IconButton,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import {
  Close,
  Visibility,
  CheckCircle,
} from '@mui/icons-material';
import { getCompletedEvaluatorsWithAnonymizedNames } from '@/utils/anonymizeEvaluator';
import type { Manuscript } from '@/types/manuscript';

interface EvaluationsListDialogProps {
  open: boolean;
  onClose: () => void;
  manuscript: Manuscript;
}

export function EvaluationsListDialog({
  open,
  onClose,
  manuscript,
}: EvaluationsListDialogProps) {
  const router = useRouter();

  // Obtenir la liste des évaluations terminées avec noms anonymisés
  const completedEvaluations = getCompletedEvaluatorsWithAnonymizedNames(
    manuscript.evaluators || []
  );

  const handleViewEvaluation = (evaluatorId: number) => {
    onClose();
    router.push(
      `/dashboard/author/manuscripts/${manuscript.id}/evaluation-results/${evaluatorId}`
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight="bold">
            Évaluations de votre manuscrit
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

      <Divider />

      <DialogContent>
        {completedEvaluations.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Aucune évaluation terminée pour le moment
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {completedEvaluations.length === 1
                ? 'Une évaluation est disponible'
                : `${completedEvaluations.length} évaluations sont disponibles`}
            </Typography>

            <List disablePadding>
              {completedEvaluations.map((evaluator) => (
                <React.Fragment key={evaluator.evaluatorId}>
                  <ListItem
                    sx={{
                      px: 0,
                      py: 2,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {evaluator.anonymizedName}
                          </Typography>
                          <Chip
                            icon={<CheckCircle />}
                            label="Terminée"
                            color="success"
                            size="small"
                          />
                        </Stack>
                      }
                      secondary={
                        evaluator.responseAt
                          ? `Soumis le ${new Date(
                              evaluator.responseAt
                            ).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}`
                          : 'Date non disponible'
                      }
                    />

                    <Button
                      variant="contained"
                      startIcon={<Visibility />}
                      onClick={() => handleViewEvaluation(evaluator.evaluatorId)}
                    >
                      Consulter
                    </Button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
