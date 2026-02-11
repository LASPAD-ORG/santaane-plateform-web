'use client';

import { Box } from '@mui/material';
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
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: { xs: 2, sm: 2.5, md: 3 },
      }}
    >
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(25% - 18px)' } }}>
        <StatCard
          title="Manuscrits soumis"
          value={stats.total_submitted}
          icon={<SendIcon />}
          color="#3B82F6"
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(25% - 18px)' } }}>
        <StatCard
          title="Manuscrits acceptés"
          value={stats.total_accepted}
          icon={<CheckCircleIcon />}
          color="#22C55E"
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(25% - 18px)' } }}>
        <StatCard
          title="Manuscrits rejetés"
          value={stats.total_rejected}
          icon={<CancelIcon />}
          color="#EF4444"
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(25% - 18px)' } }}>
        <StatCard
          title="Manuscrits publiés"
          value={stats.total_published}
          icon={<PublishIcon />}
          color="#6366F1"
        />
      </Box>
    </Box>
  );
}
