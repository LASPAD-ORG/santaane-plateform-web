'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { evaluationGridService } from '@/services/evaluationGridService';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  IconButton,
  CircularProgress,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import { useEvaluationGrid } from '../hooks/useEvaluationGrid';
import { useAlertStore } from '@/stores/alertStore';
import type { SaveEvaluationGridRequest } from '@/types/evaluationGrid';

interface EvaluationGridDialogProps {
  open: boolean;
  onClose: () => void;
  manuscriptTitle?: string;
  evaluatorName?: string;
  manuscriptId: number;
  readOnly?: boolean;
  initialData?: any;
}

const recommendationOptions = [
  {
    value: 'internal_accepted_after_revision',
    label: 'Accepté pour évaluation après révisions',
  },
  {
    value: 'internal_to_external',
    label: 'Accepté pour évaluation externe',
  },
  {
    value: 'internal_rejected',
    label: 'Refusé',
  },
];

export function EvaluationGridDialog({
  open,
  onClose,
  manuscriptTitle,
  evaluatorName,
  manuscriptId,
  readOnly = false,
  initialData,
}: EvaluationGridDialogProps) {
  const router = useRouter();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const hookResult = useEvaluationGrid({
    manuscriptId,
    articleTitle: manuscriptTitle || '',
    evaluatorName: evaluatorName || '',
    enabled: !readOnly,
  });

  const grid = readOnly ? null : hookResult.grid;
  const loading = readOnly ? false : hookResult.loading;
  const saving = readOnly ? false : hookResult.saving;
  const saveGrid = readOnly ? async () => {} : hookResult.saveGrid;

  // Form state (grille interne : 4 champs texte + décision)
  const [editorialLineFit, setEditorialLineFit] = useState('');
  const [originalityOfIdeas, setOriginalityOfIdeas] = useState('');
  const [theoreticalApproach, setTheoreticalApproach] = useState('');
  const [globalOpinion, setGlobalOpinion] = useState('');
  const [recommendation, setRecommendation] = useState <
    'internal_accepted_after_revision' | 'internal_to_external' | 'internal_rejected' | ''
  >('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const dataToLoad = readOnly ? initialData : grid;
    if (dataToLoad) {
      setEditorialLineFit(dataToLoad.editorialLineFit || '');
      setOriginalityOfIdeas(dataToLoad.originalityOfIdeas || '');
      setTheoreticalApproach(dataToLoad.theoreticalApproach || '');
      setGlobalOpinion(dataToLoad.globalOpinion || '');
      setRecommendation(dataToLoad.recommendation || '');
    }
  }, [grid, initialData, readOnly]);

  const isFormValid =
    editorialLineFit.trim() !== '' &&
    originalityOfIdeas.trim() !== '' &&
    theoreticalApproach.trim() !== '' &&
    globalOpinion.trim() !== '' &&
    recommendation !== '';

  const buildPayload = (): SaveEvaluationGridRequest => ({
    evaluatorType: 'internal',
    editorialLineFit,
    originalityOfIdeas,
    theoreticalApproach,
    globalOpinion,
    recommendation: recommendation as Exclude<typeof recommendation, ''>,
  });

  const handleSave = async () => {
    if (!isFormValid) return;
    try {
      await saveGrid(buildPayload());
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleSubmit = () => {
    if (!isFormValid) {
      if (recommendation === '') {
        useAlertStore.getState().showError('Veuillez choisir une décision avant de soumettre l\'évaluation');
      } else {
        useAlertStore.getState().showError('Veuillez remplir tous les champs requis');
      }
      return;
    }
    setConfirmDialogOpen(true);
  };

  const handleConfirmedSubmit = async () => {
    setConfirmDialogOpen(false);
    setIsSubmitting(true);
    try {
      await saveGrid(buildPayload());
      await evaluationGridService.submitEvaluation(manuscriptId);
      onClose();
      router.push('/dashboard/internal-evaluator/manuscripts');
    } catch (error) {
      useAlertStore.getState().showError('Erreur lors de la soumission de l\'évaluation');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        Grille d&apos;évaluation (interne)
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={3}>
            <TextField
              label="Titre article"
              value={manuscriptTitle}
              disabled
              fullWidth
              variant="filled"
            />

            <TextField
              label="Adéquation à la ligne éditoriale"
              multiline
              minRows={3}
              maxRows={8}
              fullWidth
              required
              disabled={readOnly}
              value={editorialLineFit}
              onChange={(e) => setEditorialLineFit(e.target.value)}
              helperText="Le sujet correspond-il aux thématiques et aux objectifs scientifiques de la revue ?"
            />

            <TextField
              label="Originalité et apport scientifique"
              multiline
              minRows={3}
              maxRows={8}
              fullWidth
              required
              disabled={readOnly}
              value={originalityOfIdeas}
              onChange={(e) => setOriginalityOfIdeas(e.target.value)}
            />

            <TextField
              label="Qualité de l'analyse et du cadre théorique"
              multiline
              minRows={3}
              maxRows={8}
              fullWidth
              required
              disabled={readOnly}
              value={theoreticalApproach}
              onChange={(e) => setTheoreticalApproach(e.target.value)}
              helperText="Méthodologie, démarche, références, approche théorique"
            />

            <TextField
              label="Avis global sur le manuscrit"
              multiline
              minRows={3}
              maxRows={8}
              fullWidth
              required
              disabled={readOnly}
              value={globalOpinion}
              onChange={(e) => setGlobalOpinion(e.target.value)}
            />

            <FormControl fullWidth required>
              <InputLabel id="recommendation-label">Décision</InputLabel>
              <Select
                labelId="recommendation-label"
                id="recommendation"
                value={recommendation}
                label="Décision"
                disabled={readOnly}
                onChange={(e) =>
                  setRecommendation(
                    e.target.value as
                      | 'internal_accepted_after_revision'
                      | 'internal_to_external'
                      | 'internal_rejected'
                      | ''
                  )
                }
              >
                <MenuItem value="" disabled>
                  <em>Choisir une décision</em>
                </MenuItem>
                {recommendationOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={saving || isSubmitting}>
          {readOnly ? 'Fermer' : 'Annuler'}
        </Button>
        {!readOnly && (
          <Stack direction="row" spacing={2}>
            <Button
              onClick={handleSave}
              variant="outlined"
              disabled={saving || !isFormValid || loading || isSubmitting}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              startIcon={<Send />}
              disabled={saving || !isFormValid || loading || isSubmitting}
            >
              {isSubmitting ? 'Soumission...' : 'Soumettre l\'évaluation'}
            </Button>
          </Stack>
        )}
      </DialogActions>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmer la soumission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment soumettre votre évaluation ? Cette action est irréversible.
            Une fois soumise, vous ne pourrez plus modifier la grille d&apos;évaluation.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirmedSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Soumission...' : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}