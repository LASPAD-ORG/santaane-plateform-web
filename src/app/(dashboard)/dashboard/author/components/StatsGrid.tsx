'use client';

import { Grid } from '@mui/material';
import StatCard from './StatCard';
import { ManuscriptStatsResponse } from '../types/dashboard.types';
import {
  Send as SendIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Publish as PublishIcon,
} from '@mui/icons-material';

interface StatsGridProps {
  stats: ManuscriptStatsResponse;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Manuscrits Soumis"
          value={stats.total_submitted}
          icon={<SendIcon />}
          color="#3B82F6"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Manuscrits Acceptés"
          value={stats.total_accepted}
          icon={<CheckCircleIcon />}
          color="#22C55E"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Manuscrits Rejetés"
          value={stats.total_rejected}
          icon={<CancelIcon />}
          color="#EF4444"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Manuscrits Publiés"
          value={stats.total_published}
          icon={<PublishIcon />}
          color="#6366F1"
        />
      </Grid>
    </Grid>
  );
}
