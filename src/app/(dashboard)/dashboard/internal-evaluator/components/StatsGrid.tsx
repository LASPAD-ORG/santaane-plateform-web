'use client';

import { Box } from '@mui/material';
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
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: { xs: 2, sm: 2.5, md: 3 },
      }}
    >
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatCard
          title="En attente d'évaluation"
          value={stats.awaiting_evaluation}
          icon={<PendingActionsIcon />}
          color="#F59E0B"
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatCard
          title="En cours d'évaluation"
          value={stats.in_progress}
          icon={<AssessmentIcon />}
          color="#3B82F6"
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatCard
          title="Manuscrits évalués"
          value={stats.evaluated}
          icon={<CheckCircleIcon />}
          color="#22C55E"
        />
      </Box>
    </Box>
  );
}
