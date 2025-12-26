'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Visibility,
  Edit,
  PictureAsPdf,
  CalendarToday,
  Assignment,
} from '@mui/icons-material';
import type { Manuscript } from '@/types/manuscript';
import { MANUSCRIPT_STATUS_LABELS, MANUSCRIPT_STATUS_COLORS } from '@/types/manuscript';
import { EvaluationsListDialog } from './EvaluationsListDialog';

interface ManuscriptCardProps {
  manuscript: Manuscript;
  onView?: (manuscript: Manuscript) => void;
  onEdit?: (manuscript: Manuscript) => void;
}

export default function ManuscriptCard({ manuscript, onView, onEdit }: ManuscriptCardProps) {
  const [evaluationsDialogOpen, setEvaluationsDialogOpen] = useState(false);

  // Calculer le nombre d'évaluations terminées
  const completedEvaluations = manuscript.evaluators?.filter(
    (e) => e.evaluationStatus === 'completed'
  ) || [];
  const hasEvaluations = completedEvaluations.length > 0;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const handleDownloadPdf = () => {
    if (manuscript.pdfFilename) {
      window.open(`/api/files/download/${manuscript.pdfFilename}`, '_blank');
    }
  };

  return (
    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" fontWeight="600" sx={{ flex: 1, pr: 2 }}>
            {manuscript.title}
          </Typography>
          <Chip
            label={MANUSCRIPT_STATUS_LABELS[manuscript.status]}
            color={MANUSCRIPT_STATUS_COLORS[manuscript.status]}
            size="small"
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {manuscript.abstract}
        </Typography>

        <Box display="flex" flexDirection="column" gap={1} mb={2}>
          {manuscript.themeName && (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                Thème:
              </Typography>
              <Typography variant="caption">{manuscript.themeName}</Typography>
            </Box>
          )}

          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="caption" color="text.secondary" fontWeight="600">
              Rubrique:
            </Typography>
            <Typography variant="caption">{manuscript.sectionName}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="caption" color="text.secondary" fontWeight="600">
              Langue:
            </Typography>
            <Typography variant="caption">{manuscript.languageName}</Typography>
          </Box>

          {manuscript.keywords && (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                Mots-clés:
              </Typography>
              <Typography variant="caption">{manuscript.keywords}</Typography>
            </Box>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            Soumis le {formatDate(manuscript.createdAt)}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={1}>
          {onView && (
            <Tooltip title="Voir les détails">
              <IconButton size="small" color="primary" onClick={() => onView(manuscript)}>
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onEdit && manuscript.status === 'revision_requested' && (
            <Tooltip title="Réviser">
              <IconButton size="small" color="warning" onClick={() => onEdit(manuscript)}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {hasEvaluations && (
            <Tooltip title={`Voir les évaluations (${completedEvaluations.length})`}>
              <IconButton
                size="small"
                color="success"
                onClick={() => setEvaluationsDialogOpen(true)}
              >
                <Assignment fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={`Télécharger le PDF`}>
            <IconButton size="small" onClick={handleDownloadPdf}>
              <PictureAsPdf fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>

      {/* Dialog pour lister les évaluations */}
      <EvaluationsListDialog
        open={evaluationsDialogOpen}
        onClose={() => setEvaluationsDialogOpen(false)}
        manuscript={manuscript}
      />
    </Card>
  );
}
