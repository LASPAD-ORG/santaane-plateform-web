'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Stack,
  Typography,
  TextField,
  IconButton,
  MenuItem,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close, Save } from '@mui/icons-material';
import type { EvaluationGrid, EvaluationRecommendation } from '@/types/evaluationGrid';
import { editorEvaluationService } from '@/services/editorEvaluationService';
import { useAlertStore } from '@/stores/alertStore';

interface EvaluationGridEditorProps {
  open: boolean;
  onClose: () => void;
  manuscriptId: number;
  evaluatorId: number;
  grid: EvaluationGrid;
  onSaved?: () => void;
}

const recommendationOptions: { value: EvaluationRecommendation; label: string }[] = [
  { value: 'accepted_with_validation', label: 'Accepté sous réserve de validation' },
  { value: 'resubmission_required', label: 'Soumission d\'une nouvelle version' },
  { value: 'rejected', label: 'Refusé' },
  { value: 'internal_accepted_after_revision', label: 'Accepté pour évaluation après révisions' },
  { value: 'internal_to_external', label: 'Accepté pour évaluation externe' },
  { value: 'internal_rejected', label: 'Refusé (interne)' },
];

interface FormState {
  originalityOfIdeas: string;
  methodologyRigor: string;
  theoreticalApproach: string;
  presentationClarity: string;
  strengths: string;
  weaknesses: string;
  suggestions: string;
  editorialLineFit: string;
  globalOpinion: string;
  recommendation: EvaluationRecommendation;
}

function gridToForm(grid: EvaluationGrid): FormState {
  return {
    originalityOfIdeas: grid.originalityOfIdeas ?? '',
    methodologyRigor: grid.methodologyRigor ?? '',
    theoreticalApproach: grid.theoreticalApproach ?? '',
    presentationClarity: grid.presentationClarity ?? '',
    strengths: grid.strengths ?? '',
    weaknesses: grid.weaknesses ?? '',
    suggestions: grid.suggestions ?? '',
    editorialLineFit: grid.editorialLineFit ?? '',
    globalOpinion: grid.globalOpinion ?? '',
    recommendation: grid.recommendation,
  };
}

export function EvaluationGridEditor({
  open,
  onClose,
  manuscriptId,
  evaluatorId,
  grid,
  onSaved,
}: EvaluationGridEditorProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { showSuccess, showError } = useAlertStore();

  const [form, setForm] = useState<FormState>(gridToForm(grid));
  const [saving, setSaving] = useState(false);

  // Re-synchroniser le formulaire quand la grille change ou que le dialogue s'ouvre
  useEffect(() => {
    if (open) {
      setForm(gridToForm(grid));
    }
  }, [open, grid]);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = async () => {
    setSaving(true);
    try {
      await editorEvaluationService.editorUpdateGrid(manuscriptId, evaluatorId, {
        originalityOfIdeas: form.originalityOfIdeas,
        methodologyRigor: form.methodologyRigor,
        theoreticalApproach: form.theoreticalApproach,
        presentationClarity: form.presentationClarity,
        strengths: form.strengths,
        weaknesses: form.weaknesses,
        suggestions: form.suggestions,
        editorialLineFit: form.editorialLineFit,
        globalOpinion: form.globalOpinion,
        recommendation: form.recommendation,
      });
      showSuccess('Grille mise à jour.');
      onSaved?.();
      onClose();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Erreur lors de l\'enregistrement de la grille';
      showError(msg);
    } finally {
      setSaving(false);
    }
  };

  const field = (
    label: string,
    key: keyof FormState,
    rows = 4,
  ) => (
    <TextField
      label={label}
      value={form[key]}
      onChange={handleChange(key)}
      fullWidth
      multiline
      minRows={rows}
      disabled={saving}
    />
  );

  return (
    <Dialog
      open={open}
      onClose={() => !saving && onClose()}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      scroll="paper"
    >
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight="600">
            Modifier la grille d&apos;évaluation
          </Typography>
          <IconButton onClick={onClose} disabled={saving}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Alert severity="info" sx={{ mb: 3, mt: 1 }}>
          Vous modifiez la grille produite par l&apos;évaluateur. Vos changements remplaceront son
          contenu avant transmission à l&apos;auteur.
        </Alert>

        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Article
            </Typography>
            <Typography variant="h6" fontWeight="500">
              {grid.articleTitle}
            </Typography>
          </Box>

          <TextField
            select
            label="Recommandation finale"
            value={form.recommendation}
            onChange={handleChange('recommendation')}
            fullWidth
            disabled={saving}
          >
            {recommendationOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="subtitle1" fontWeight="600" color="primary.main">
            Critères d&apos;évaluation
          </Typography>
          {field('Originalité et pertinence des idées', 'originalityOfIdeas')}
          {field('Méthode et rigueur scientifique', 'methodologyRigor')}
          {field('Approche théorique et empirique', 'theoreticalApproach')}
          {field('Présentation et clarté', 'presentationClarity')}
          {field('Adéquation à la ligne éditoriale', 'editorialLineFit')}
          {field('Opinion globale', 'globalOpinion')}

          <Typography variant="subtitle1" fontWeight="600" color="primary.main">
            Synthèse de l&apos;évaluation
          </Typography>
          {field('Points forts', 'strengths')}
          {field('Points faibles', 'weaknesses')}
          {field('Suggestions pour améliorer le texte', 'suggestions')}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} disabled={saving}>
          Annuler
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={18} /> : <Save />}
        >
          Enregistrer les modifications
        </Button>
      </DialogActions>
    </Dialog>
  );
}