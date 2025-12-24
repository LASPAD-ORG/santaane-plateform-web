'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  manuscriptTitle: string;
  evaluatorName: string;
  manuscriptId: number;
}

const recommendationOptions = [
  {
    value: 'accepted_with_validation',
    label: 'Accepté sous réserve de validation par le comité de rédaction'
  },
  {
    value: 'resubmission_required',
    label: 'Soumission d\'une nouvelle version'
  },
  {
    value: 'rejected',
    label: 'Refusé'
  }
];

export function EvaluationGridDialog({
  open,
  onClose,
  manuscriptTitle,
  evaluatorName,
  manuscriptId,
}: EvaluationGridDialogProps) {
  const router = useRouter();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { grid, loading, saving, saveGrid } = useEvaluationGrid({
    manuscriptId,
    articleTitle: manuscriptTitle,
    evaluatorName,
  });

  // Form state
  const [originalityOfIdeas, setOriginalityOfIdeas] = useState('');
  const [methodologyRigor, setMethodologyRigor] = useState('');
  const [theoreticalApproach, setTheoreticalApproach] = useState('');
  const [presentationClarity, setPresentationClarity] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [recommendation, setRecommendation] = useState<
    'accepted_with_validation' | 'resubmission_required' | 'rejected'
  >('accepted_with_validation');

  // Confirmation dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing grid data into form
  useEffect(() => {
    if (grid) {
      setOriginalityOfIdeas(grid.originalityOfIdeas);
      setMethodologyRigor(grid.methodologyRigor);
      setTheoreticalApproach(grid.theoreticalApproach);
      setPresentationClarity(grid.presentationClarity);
      setStrengths(grid.strengths);
      setWeaknesses(grid.weaknesses);
      setSuggestions(grid.suggestions);
      setRecommendation(grid.recommendation);
    }
  }, [grid]);

  // Form validation
  const isFormValid =
    originalityOfIdeas.trim() !== '' &&
    methodologyRigor.trim() !== '' &&
    theoreticalApproach.trim() !== '' &&
    presentationClarity.trim() !== '' &&
    strengths.trim() !== '' &&
    weaknesses.trim() !== '' &&
    recommendation !== '';

  // Handle save
  const handleSave = async () => {
    if (!isFormValid) return;

    const data: SaveEvaluationGridRequest = {
      originalityOfIdeas,
      methodologyRigor,
      theoreticalApproach,
      presentationClarity,
      strengths,
      weaknesses,
      suggestions,
      recommendation,
    };

    try {
      await saveGrid(data);
      // Ne pas fermer le dialog après sauvegarde - permet de continuer à modifier
    } catch (error) {
      // Error handled by hook
    }
  };

  // Handle submit evaluation
  const handleSubmit = () => {
    if (!isFormValid) {
      useAlertStore.getState().showError('Veuillez remplir tous les champs requis');
      return;
    }
    // Open confirmation dialog
    setConfirmDialogOpen(true);
  };

  // Handle confirmed submission
  const handleConfirmedSubmit = async () => {
    setConfirmDialogOpen(false);
    setIsSubmitting(true);

    try {
      // 1. Sauvegarder la grille d'abord
      const data: SaveEvaluationGridRequest = {
        originalityOfIdeas,
        methodologyRigor,
        theoreticalApproach,
        presentationClarity,
        strengths,
        weaknesses,
        suggestions,
        recommendation,
      };
      await saveGrid(data);

      // 2. TODO: Appeler API pour soumettre l'évaluation complète
      // Simuler l'envoi pour le moment
      await new Promise((resolve) => setTimeout(resolve, 1000));

      useAlertStore.getState().showSuccess('Évaluation soumise avec succès !');
      onClose();
      router.push('/dashboard/evaluator/manuscripts');
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
        Grille d&apos;Évaluation
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
            {/* Champs lecture seule */}
            <TextField
              label="Titre article"
              value={manuscriptTitle}
              disabled
              fullWidth
              variant="filled"
            />
            <TextField
              label="Lecteur"
              value={evaluatorName}
              disabled
              fullWidth
              variant="filled"
            />

            {/* Champs éditables */}
            <TextField
              label="Originalité des idées et des conclusions"
              multiline
              minRows={3}
              maxRows={8}
              fullWidth
              required
              value={originalityOfIdeas}
              onChange={(e) => setOriginalityOfIdeas(e.target.value)}
              helperText="Évaluez l'originalité et la pertinence des idées présentées"
            />

            <TextField
              label="Pertinence et rigueur de la méthode, de la démarche et des références"
              multiline
              minRows={3}
              maxRows={8}
              fullWidth
              required
              value={methodologyRigor}
              onChange={(e) => setMethodologyRigor(e.target.value)}
              helperText="Commentez la rigueur méthodologique et la qualité des références"
            />

            <TextField
              label="Recours à des études empiriques et une approche théorique solide"
              multiline
              minRows={3}
              maxRows={8}
              fullWidth
              required
              value={theoreticalApproach}
              onChange={(e) => setTheoreticalApproach(e.target.value)}
              helperText="Évaluez la solidité de l'approche théorique et empirique"
            />

            <TextField
              label="Soin dans la présentation et la structure du texte, clarté de l'expression"
              multiline
              minRows={3}
              maxRows={8}
              fullWidth
              required
              value={presentationClarity}
              onChange={(e) => setPresentationClarity(e.target.value)}
              helperText="Commentez la qualité de la rédaction et de la présentation"
            />

            <TextField
              label="Points forts"
              multiline
              minRows={3}
              maxRows={8}
              fullWidth
              required
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              helperText="Listez les principaux points forts de l'article"
            />

            <TextField
              label="Points faibles"
              multiline
              minRows={3}
              maxRows={8}
              fullWidth
              required
              value={weaknesses}
              onChange={(e) => setWeaknesses(e.target.value)}
              helperText="Listez les principaux points faibles à améliorer"
            />

            <TextField
              label="Suggestions pour améliorer le texte"
              multiline
              minRows={3}
              maxRows={8}
              fullWidth
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              helperText="Proposez des pistes d'amélioration concrètes (optionnel)"
            />

            {/* Select pour l'avis */}
            <FormControl fullWidth required>
              <InputLabel id="recommendation-label">Avis</InputLabel>
              <Select
                labelId="recommendation-label"
                id="recommendation"
                value={recommendation}
                label="Avis"
                onChange={(e) =>
                  setRecommendation(
                    e.target.value as
                      | 'accepted_with_validation'
                      | 'resubmission_required'
                      | 'rejected'
                  )
                }
              >
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
          Annuler
        </Button>
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
      </DialogActions>

      {/* Confirmation Dialog */}
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
