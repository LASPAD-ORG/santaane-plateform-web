'use client';

import { useEffect, useState } from 'react';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Button, Chip, CircularProgress, Dialog, DialogTitle, DialogContent,
  IconButton, Divider, Stack, Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import { versionService } from '@/services/versionService';
import type { ManuscriptVersion, ArchivedGrid, ArchivedAnnotation } from '@/types/version';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface VersionHistoryProps {
  manuscriptId: number;
}

const RECOMMENDATION_LABELS: Record<string, string> = {
  accepted_with_validation: 'Accepté avec validation',
  resubmission_required: 'Nouvelle soumission requise',
  rejected: 'Rejeté',
};

function anonymizedEvaluator(evaluatorId: number, kind?: string | null): string {
  const base = `Évaluateur SLSP${evaluatorId}`;
  if (kind === 'internal') return `${base} (interne)`;
  if (kind === 'external') return `${base} (externe)`;
  return base;
}

export default function VersionHistory({ manuscriptId }: VersionHistoryProps) {
  const [versions, setVersions] = useState<ManuscriptVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogVersion, setDialogVersion] = useState<ManuscriptVersion | null>(null);
  const [grids, setGrids] = useState<ArchivedGrid[]>([]);
  const [annotations, setAnnotations] = useState<ArchivedAnnotation[]>([]);
  const [dialogLoading, setDialogLoading] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const data = await versionService.listVersions(manuscriptId);
        if (active) setVersions(data);
      } catch (e: any) {
        if (active) setError("Impossible de charger l'historique des versions.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [manuscriptId]);

  const openEvaluations = async (version: ManuscriptVersion) => {
    setDialogVersion(version);
    setDialogOpen(true);
    setDialogLoading(true);
    try {
      const [g, a] = await Promise.all([
        versionService.getVersionGrids(manuscriptId, version.id),
        versionService.getVersionAnnotations(manuscriptId, version.id),
      ]);
      setGrids(g);
      setAnnotations(a);
    } catch (e) {
      setGrids([]);
      setAnnotations([]);
    } finally {
      setDialogLoading(false);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogVersion(null);
    setGrids([]);
    setAnnotations([]);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;
  }

  if (versions.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
        <HistoryIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
        <Typography>Aucune version archivée pour ce manuscrit.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <HistoryIcon /> Historique des versions
      </Typography>

      {versions.map((v) => (
        <Accordion key={v.id} defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip label={`Version ${v.versionNumber}`} color="primary" size="small" />
              <Typography sx={{ fontWeight: 500 }}>{v.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                Archivée le {new Date(v.archivedAt).toLocaleDateString('fr-FR')}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
              {v.pdfFilename && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PictureAsPdfIcon />}
                  href={`${API_URL}/api/v1/files/view/${v.pdfFilename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Voir le PDF
                </Button>
              )}
              <Button
                variant="contained"
                size="small"
                startIcon={<AssignmentIcon />}
                onClick={() => openEvaluations(v)}
              >
                Voir les évaluations
              </Button>
            </Stack>
            {v.abstract && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {v.abstract}
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Dialog evaluations d'une version */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            Évaluations — Version {dialogVersion?.versionNumber}
          </span>
          <IconButton onClick={closeDialog} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {dialogLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Grilles */}
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Grilles d'évaluation ({grids.length})
              </Typography>
              {grids.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Aucune grille archivée pour cette version.
                </Typography>
              ) : (
                grids.map((g) => (
                  <Box key={g.id} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      <Chip label={anonymizedEvaluator(g.evaluatorId, g.evaluatorKind)} size="small" />
                      {g.recommendation && (
                        <Chip
                          label={RECOMMENDATION_LABELS[g.recommendation] || g.recommendation}
                          size="small"
                          color="secondary"
                        />
                      )}
                    </Box>
                    <FieldLine label="Originalité et pertinence des idées" value={g.originalityOfIdeas} />
                    <FieldLine label="Rigueur méthodologique" value={g.methodologyRigor} />
                    <FieldLine label="Approche théorique et empirique" value={g.theoreticalApproach} />
                    <FieldLine label="Présentation et clarté" value={g.presentationClarity} />
                    <FieldLine label="Points forts" value={g.strengths} />
                    <FieldLine label="Points faibles" value={g.weaknesses} />
                    {g.suggestions && <FieldLine label="Suggestions d'amélioration" value={g.suggestions} />}
                    {g.editorialLineFit && <FieldLine label="Adéquation à la ligne éditoriale" value={g.editorialLineFit} />}
                    {g.globalOpinion && <FieldLine label="Avis global" value={g.globalOpinion} />}
                  </Box>
                ))
              )}

              <Divider sx={{ my: 2 }} />

              {/* Annotations */}
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Annotations ({annotations.length})
              </Typography>
              {annotations.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Aucune annotation archivée pour cette version.
                </Typography>
              ) : (
                annotations.map((a) => (
                  <Box key={a.id} sx={{ mb: 1.5, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5, flexWrap: 'wrap' }}>
                      <Chip label={anonymizedEvaluator(a.evaluatorId, a.evaluatorKind)} size="small" variant="outlined" />
                      {a.pageNumber != null && (
                        <Typography variant="caption" color="text.secondary">Page {a.pageNumber}</Typography>
                      )}
                    </Box>
                    {a.comment && <Typography variant="body2">{a.comment}</Typography>}
                  </Box>
                ))
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

function FieldLine({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>{label}</Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}