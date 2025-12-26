'use client';

import { Grid } from '@mui/material';
import StatCard from './StatCard';
import { EvaluatorStatsResponse } from '../types/dashboard.types';
import {
  PendingActions as PendingActionsIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

interface StatsGridProps {
  stats: EvaluatorStatsResponse;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="En Attente d'Évaluation"
          value={stats.awaiting_evaluation}
          icon={<PendingActionsIcon />}
          color="#F59E0B"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="En Cours d'Évaluation"
          value={stats.in_progress}
          icon={<AssessmentIcon />}
          color="#3B82F6"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Manuscrits Évalués"
          value={stats.evaluated}
          icon={<CheckCircleIcon />}
          color="#22C55E"
        />
      </Grid>
    </Grid>
  );
}
