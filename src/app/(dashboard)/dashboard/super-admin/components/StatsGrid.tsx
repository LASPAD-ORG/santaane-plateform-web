'use client';

import { Box } from '@mui/material';
import StatCard from './StatCard';
import { SystemStatsResponse } from '../types/dashboard.types';
import {
  Description as DescriptionIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Publish as PublishIcon,
  Group as GroupIcon,
  Edit as EditIcon,
  RateReview as RateReviewIcon,
  PendingActions as PendingActionsIcon,
  TrendingUp as TrendingUpIcon,
  Send as SendIcon,
} from '@mui/icons-material';

interface StatsGridProps {
  stats: SystemStatsResponse;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: { xs: 2, sm: 2.5, md: 3 },
      }}
    >
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatCard
          title="Total manuscrits"
          value={stats.total_manuscripts}
          icon={<DescriptionIcon />}
          color="#3B82F6"
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatCard
          title="En évaluation"
          value={stats.in_evaluation}
          icon={<AssessmentIcon />}
          color="#F59E0B"
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatCard
          title="Soumis"
          value={stats.total_submitted}
          icon={<SendIcon />}
          color="#8B5CF6"
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatCard
          title="En attente d'évaluateur"
          value={stats.awaiting_evaluators}
          icon={<PendingActionsIcon />}
          color="#F97316"
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatCard
          title="Acceptés"
          value={stats.total_accepted}
          icon={<CheckCircleIcon />}
          color="#22C55E"
          subtitle={`Taux: ${stats.acceptance_rate}%`}
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatCard
          title="Rejetés"
          value={stats.total_rejected}
          icon={<CancelIcon />}
          color="#EF4444"
          subtitle={`Taux: ${stats.rejection_rate}%`}
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatCard
          title="Publiés"
          value={stats.total_published}
          icon={<PublishIcon />}
          color="#6366F1"
          subtitle={`Taux: ${stats.publication_rate}%`}
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatCard
          title="Auteurs"
          value={stats.total_authors}
          icon={<GroupIcon />}
          color="#10B981"
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatCard
          title="Éditeurs"
          value={stats.total_editors}
          icon={<EditIcon />}
          color="#14B8A6"
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatCard
          title="Évaluateurs"
          value={stats.total_evaluators}
          icon={<RateReviewIcon />}
          color="#06B6D4"
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatCard
          title="Taux d'évaluation"
          value={`${stats.evaluation_rate}%`}
          icon={<TrendingUpIcon />}
          color="#8B5CF6"
        />
      </Box>
    </Box>
  );
}
