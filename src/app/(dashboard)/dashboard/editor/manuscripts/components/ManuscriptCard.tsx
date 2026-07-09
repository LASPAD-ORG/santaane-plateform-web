import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Badge,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  Visibility,
  PictureAsPdf,
  CalendarToday,
  MoreVert,
  Edit,
  PersonAdd,
  Person,
  HourglassEmpty,
  ThumbUp,
  ThumbDown,
  CheckCircleOutline,
  History,
  Block,
  Description,
  RateReview,
} from '@mui/icons-material';
import { Manuscript, MANUSCRIPT_STATUS_LABELS, MANUSCRIPT_STATUS_COLORS } from '@/types/manuscript';
import { useState } from 'react';
import axios from 'axios';
import { useAlertStore } from '@/stores/alertStore';
import AssignEvaluatorDialog from './AssignEvaluatorDialog';
import AssignInternalEvaluatorDialog from './AssignInternalEvaluatorDialog';
import EvaluatorHistoryDialog from './EvaluatorHistoryDialog';
// Importation du nouveau dialogue de gestion éditoriale
import EditorialManagerDialog from './EditorialManagerDialog';
import ManuscriptStatusModal from './ManuscriptStatusModal';

interface ManuscriptCardProps {
  manuscript: Manuscript;
  onUpdate?: () => void;
}

export default function ManuscriptCard({ manuscript, onUpdate }: ManuscriptCardProps) {
  const router = useRouter();
  const { showSuccess, showError } = useAlertStore();
  const [updating, setUpdating] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openInternalAssignDialog, setOpenInternalAssignDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  // 1. Nouvel état pour le dialogue de gestion éditoriale
  const [openEditorialDialog, setOpenEditorialDialog] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
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

  const handleViewDetails = () => {
    router.push(`/dashboard/editor/manuscripts/${manuscript.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/editor/manuscripts/${manuscript.id}/edit`);
  };

  const handleAnonymize = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/editor/manuscripts/${manuscript.id}/anonymize`);
  };

  const handleOpenStatusModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
  };

  const handleOpenAssignDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenAssignDialog(true);
  };

  const handleCloseAssignDialog = () => {
    setOpenAssignDialog(false);
  };

  const handleOpenHistoryDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenHistoryDialog(true);
  };

  const handleCloseHistoryDialog = () => {
    setOpenHistoryDialog(false);
  };

  const handleDownloadDocx = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (manuscript.docxFilename) {
      window.open(`/api/files/download/${manuscript.docxFilename}`, '_blank');
    }
  };

  // Statistiques des évaluateurs (logique originale restaurée)
  const evaluators = manuscript.evaluators || [];
  const totalEvaluators = evaluators.length;
  const pendingEvaluators = evaluators.filter(e => e.status === 'pending').length;
  const acceptedEvaluators = evaluators.filter(e => e.status === 'accepted').length;
  const rejectedEvaluators = evaluators.filter(e => e.status === 'rejected').length;
  const completedEvaluators = evaluators.filter(e => e.status === 'completed').length;

  // Calcul du statut d'évaluation global basé sur les données individuelles
  const calculateGlobalEvaluationStatus = () => {
    const acceptedEvals = evaluators.filter(e => e.status === 'accepted');
    if (acceptedEvals.length === 0) return null;
    
    const completedEvaluations = acceptedEvals.filter(e => e.evaluationStatus === 'completed').length;
    
    if (completedEvaluations === acceptedEvals.length) {
      return { status: 'completed', label: 'Évaluations terminées', color: 'success' };
    } else {
      return { status: 'in_progress', label: `${completedEvaluations}/${acceptedEvals.length} terminées`, color: 'primary' };
    }
  };

  const globalEvaluationStatus = calculateGlobalEvaluationStatus();

  const getEvaluatorStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'info';
      case 'rejected': return 'error';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getEvaluatorStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <HourglassEmpty fontSize="small" />;
      case 'accepted': return <ThumbUp fontSize="small" />;
      case 'rejected': return <ThumbDown fontSize="small" />;
      case 'completed': return <CheckCircleOutline fontSize="small" />;
      default: return null;
    }
  };

  const getEvaluatorStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente de réponse';
      case 'accepted': return 'Évaluation acceptée';
      case 'rejected': return 'Évaluation refusée';
      case 'completed': return 'Évaluation terminée';
      default: return 'Statut inconnu';
    }
  };

  const getEvaluatorTooltip = (evaluator: any) => {
    const statusLabel = getEvaluatorStatusLabel(evaluator.status);
    const assignedDate = formatDate(evaluator.assignedAt);
    const responseDate = evaluator.responseAt ? formatDate(evaluator.responseAt) : null;
    const deadline = evaluator.evaluationDeadline ? formatDate(evaluator.evaluationDeadline) : null;

    let tooltip = `${evaluator.evaluatorName}\n${evaluator.evaluatorEmail}\n\nStatut: ${statusLabel}\nAssigné le: ${assignedDate}`;
    
    if (responseDate) {
      tooltip += `\nRéponse le: ${responseDate}`;
    }
    
    if (deadline) {
      tooltip += `\nDate limite: ${deadline}`;
    }

    return tooltip;
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={handleViewDetails}
    >
      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Chip
            label={MANUSCRIPT_STATUS_LABELS[manuscript.status]}
            color={MANUSCRIPT_STATUS_COLORS[manuscript.status]}
            size="small"
          />
          <Box display="flex" gap={0.5}>
            <Tooltip title="Voir détails">
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleViewDetails(); }} disabled={updating}>
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Modifier">
              <IconButton size="small" onClick={handleEdit} disabled={updating}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={manuscript.isAnonymized ? "Manuscrit anonymisé" : "Anonymiser le manuscrit"}>
              <IconButton
                size="small"
                onClick={handleAnonymize}
                disabled={updating}
                color={manuscript.isAnonymized ? "success" : "default"}
              >
                <Block fontSize="small" />
              </IconButton>
            </Tooltip>
            {/* Étape 1 : assigner un évaluateur INTERNE (si anonymisé et pas encore validé) */}
            {manuscript.isAnonymized && !manuscript.isInternallyValidated && (
              <Tooltip title="Assigner un évaluateur interne">
                <IconButton
                  size="small"
                  color="secondary"
                  onClick={(e) => { e.stopPropagation(); setOpenInternalAssignDialog(true); }}
                  disabled={updating}
                >
                  <Person fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {/* Étape 2 : assigner des évaluateurs EXTERNES (débloqué après validation interne) */}
            <Tooltip title={
              manuscript.isInternallyValidated
                ? "Assigner un évaluateur externe"
                : "Validation interne requise avant d'assigner des externes"
            }>
              <span>
                <IconButton
                  size="small"
                  onClick={handleOpenAssignDialog}
                  disabled={updating || !manuscript.isInternallyValidated}
                >
                  <PersonAdd fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            {manuscript.status === 'accepted' && (
              <Tooltip title="Gestion éditoriale (Versions Word)">
                <IconButton 
                  size="small" 
                  color="primary" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    setOpenEditorialDialog(true); 
                  }}
                >
                  <RateReview fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Gestion du statut">
              <IconButton size="small" onClick={handleOpenStatusModal} disabled={updating}>
                <MoreVert fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
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
          {manuscript.themeName && (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="caption" color="text.secondary">
                Appel:
              </Typography>
              <Typography variant="caption" fontWeight="500">
                {manuscript.themeName}
              </Typography>
            </Box>
          )}

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

        {/* Évaluateurs avec statut d'évaluation */}
        {totalEvaluators > 0 && (
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="caption" color="text.secondary">
                Évaluateurs ({totalEvaluators})
              </Typography>
              <Tooltip title="Voir l'historique des évaluateurs">
                <IconButton 
                  size="small" 
                  onClick={handleOpenHistoryDialog}
                  sx={{ p: 0.5 }}
                >
                  <History fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            
            {globalEvaluationStatus && (
              <Box mb={1}>
                <Chip
                  label={globalEvaluationStatus.label}
                  color={globalEvaluationStatus.color as any}
                  size="small"
                  variant="outlined"
                />
              </Box>
            )}
            
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {evaluators.map((evaluator) => (
                <Tooltip 
                  key={evaluator.evaluatorId} 
                  title={
                    <Box sx={{ whiteSpace: 'pre-line' }}>
                      {getEvaluatorTooltip(evaluator)}
                    </Box>
                  }
                  arrow
                >
                  <Chip
                    label={evaluator.evaluatorName}
                    color={getEvaluatorStatusColor(evaluator.status) as any}
                    size="small"
                    variant="outlined"
                  />
                </Tooltip>
              ))}
            </Stack>
          </Box>
        )}

        {totalEvaluators === 0 && (
          <Box mb={2}>
            <Chip
              label="Aucun évaluateur assigné"
              color="default"
              size="small"
              variant="outlined"
            />
          </Box>
        )}

        {/* Footer */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pt={2}
          borderTop="1px solid"
          borderColor="divider"
        >
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(manuscript.createdAt)}
            </Typography>
          </Box>

          {manuscript.docxFilename && (
            <Tooltip title="Télécharger le DOCX">
              <IconButton size="small" color="success" onClick={handleDownloadDocx}>
                <Description fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>

      {/* Dialogs - Ajout de stopPropagation pour isoler les interactions */}
      <Box onClick={(e) => e.stopPropagation()}>
        <AssignInternalEvaluatorDialog
          open={openInternalAssignDialog}
          onClose={() => setOpenInternalAssignDialog(false)}
          manuscriptId={manuscript.id}
          manuscriptTitle={manuscript.title}
          onSuccess={onUpdate}
        />
        <AssignEvaluatorDialog
          open={openAssignDialog}
          onClose={handleCloseAssignDialog}
          manuscriptId={manuscript.id}
          manuscriptTitle={manuscript.title}
          onSuccess={onUpdate}
        />


        <EvaluatorHistoryDialog
          open={openHistoryDialog}
          onClose={handleCloseHistoryDialog}
          manuscriptTitle={manuscript.title}
          manuscriptId={manuscript.id}
          evaluators={evaluators}
        />

        <EditorialManagerDialog
          open={openEditorialDialog}
          onClose={() => setOpenEditorialDialog(false)}
          manuscript={manuscript}
          onUpdate={onUpdate}
        />
      </Box>

      {/* Manuscript Status Modal */}
      <ManuscriptStatusModal
        open={openStatusModal}
        onClose={handleCloseStatusModal}
        manuscriptId={manuscript.id}
        manuscriptTitle={manuscript.title}
        currentStatus={manuscript.status}
        onSuccess={onUpdate}
      />

      {/* Evaluator History Dialog */}
      <EvaluatorHistoryDialog
        open={openHistoryDialog}
        onClose={handleCloseHistoryDialog}
        manuscriptTitle={manuscript.title}
        manuscriptId={manuscript.id}
        evaluators={evaluators}
      />
      
    </Card>
  );
}