import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Stack,
} from '@mui/material';
import {
  Visibility,
  PictureAsPdf,
  CalendarToday,
  MoreVert,
  Edit,
  CheckCircle,
  Cancel,
  RateReview,
  PersonAdd,
  HourglassEmpty,
  ThumbUp,
  ThumbDown,
  CheckCircleOutline,
  History,
  Block,
} from '@mui/icons-material';
import { Manuscript, MANUSCRIPT_STATUS_LABELS, MANUSCRIPT_STATUS_COLORS } from '@/types/manuscript';
import { useState } from 'react';
import axios from 'axios';
import { useAlertStore } from '@/stores/alertStore';
import AssignEvaluatorDialog from './AssignEvaluatorDialog';
import EvaluatorHistoryDialog from './EvaluatorHistoryDialog';

interface ManuscriptCardProps {
  manuscript: Manuscript;
  onUpdate?: () => void;
}

export default function ManuscriptCard({ manuscript, onUpdate }: ManuscriptCardProps) {
  const router = useRouter();
  const { showSuccess, showError } = useAlertStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [updating, setUpdating] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);

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

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAnchorEl(null);
  };

  const handleStatusChange = async (e: React.MouseEvent, newStatus: string) => {
    e.stopPropagation();
    handleMenuClose();
    
    setUpdating(true);
    try {
      await axios.put(`/api/manuscripts/detail/${manuscript.id}/status`, {
        status: newStatus,
      });

      showSuccess('Statut mis à jour avec succès');
      onUpdate?.();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      showError('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdating(false);
    }
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

  // Statistiques des évaluateurs
  const evaluators = manuscript.evaluators || [];
  const totalEvaluators = evaluators.length;
  const pendingEvaluators = evaluators.filter(e => e.status === 'pending').length;
  const acceptedEvaluators = evaluators.filter(e => e.status === 'accepted').length;
  const rejectedEvaluators = evaluators.filter(e => e.status === 'rejected').length;
  const completedEvaluators = evaluators.filter(e => e.status === 'completed').length;

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
              <IconButton size="small" onClick={handleViewDetails} disabled={updating}>
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
            <Tooltip title="Assigner un évaluateur">
              <IconButton size="small" onClick={handleOpenAssignDialog} disabled={updating}>
                <PersonAdd fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Actions">
              <IconButton size="small" onClick={handleMenuOpen} disabled={updating}>
                <MoreVert fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleMenuClose()}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={(e) => handleStatusChange(e, 'revision_requested')}>
            <ListItemIcon>
              <RateReview fontSize="small" />
            </ListItemIcon>
            <ListItemText>Demander révision</ListItemText>
          </MenuItem>
          <MenuItem onClick={(e) => handleStatusChange(e, 'accepted')}>
            <ListItemIcon>
              <CheckCircle fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Accepter</ListItemText>
          </MenuItem>
          <MenuItem onClick={(e) => handleStatusChange(e, 'rejected')}>
            <ListItemIcon>
              <Cancel fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Rejeter</ListItemText>
          </MenuItem>
          <MenuItem onClick={(e) => handleStatusChange(e, 'published')}>
            <ListItemIcon>
              <Visibility fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText>Publier</ListItemText>
          </MenuItem>
        </Menu>

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
                Thème:
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

        {/* Évaluateurs - Nouveaux badges */}
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
              icon={<PersonAdd />}
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

          <PictureAsPdf sx={{ fontSize: 20, color: 'error.main' }} />
        </Box>
      </CardContent>

      {/* Assign Evaluator Dialog */}
      <AssignEvaluatorDialog
        open={openAssignDialog}
        onClose={handleCloseAssignDialog}
        manuscriptId={manuscript.id}
        manuscriptTitle={manuscript.title}
        onSuccess={onUpdate}
      />

      {/* Evaluator History Dialog */}
      <EvaluatorHistoryDialog
        open={openHistoryDialog}
        onClose={handleCloseHistoryDialog}
        manuscriptTitle={manuscript.title}
        evaluators={evaluators}
      />
    </Card>
  );
}
