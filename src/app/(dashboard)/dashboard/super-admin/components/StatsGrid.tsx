'use client';

import { Grid } from '@mui/material';
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
    <Grid container spacing={3}>
      {/* Row 1: 3 cards */}
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Total Manuscripts"
          value={stats.total_manuscripts}
          icon={<DescriptionIcon />}
          color="#3B82F6"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="En Évaluation"
          value={stats.in_evaluation}
          icon={<AssessmentIcon />}
          color="#F59E0B"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Soumis"
          value={stats.total_submitted}
          icon={<SendIcon />}
          color="#8B5CF6"
        />
      </Grid>

      {/* Row 2: 3 cards */}
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="En Attente d'Évaluateur"
          value={stats.awaiting_evaluators}
          icon={<PendingActionsIcon />}
          color="#F97316"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Acceptés"
          value={stats.total_accepted}
          icon={<CheckCircleIcon />}
          color="#22C55E"
          subtitle={`Taux: ${stats.acceptance_rate}%`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Rejetés"
          value={stats.total_rejected}
          icon={<CancelIcon />}
          color="#EF4444"
          subtitle={`Taux: ${stats.rejection_rate}%`}
        />
      </Grid>

      {/* Row 3: 3 cards */}
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Publiés"
          value={stats.total_published}
          icon={<PublishIcon />}
          color="#6366F1"
          subtitle={`Taux: ${stats.publication_rate}%`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Auteurs"
          value={stats.total_authors}
          icon={<GroupIcon />}
          color="#10B981"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Éditeurs"
          value={stats.total_editors}
          icon={<EditIcon />}
          color="#14B8A6"
        />
      </Grid>

      {/* Row 4: 3 cards */}
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Évaluateurs"
          value={stats.total_evaluators}
          icon={<RateReviewIcon />}
          color="#06B6D4"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Taux d'Évaluation"
          value={`${stats.evaluation_rate}%`}
          icon={<TrendingUpIcon />}
          color="#8B5CF6"
        />
      </Grid>
    </Grid>
  );
}
