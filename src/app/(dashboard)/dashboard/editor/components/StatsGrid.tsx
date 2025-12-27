'use client';

import { Box, Paper, Typography, Stack, Chip } from '@mui/material';
import { SystemStatsResponse } from '../types/dashboard.types';
import {
  Description,
  Assessment,
  CheckCircle,
  Cancel,
  Publish,
  Group,
  RateReview,
} from '@mui/icons-material';

interface StatsGridProps {
  stats: SystemStatsResponse;
}

interface StatItemProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

function StatItem({ label, value, icon, color, subtitle }: StatItemProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1.5,
          bgcolor: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" fontWeight="700">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
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
        <StatItem
          label="Total Manuscrits"
          value={stats.total_manuscripts}
          icon={<Description />}
          color="#3B82F6"
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatItem
          label="En Évaluation"
          value={stats.in_evaluation}
          icon={<Assessment />}
          color="#F59E0B"
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatItem
          label="Acceptés"
          value={stats.total_accepted}
          icon={<CheckCircle />}
          color="#22C55E"
          subtitle={`${stats.acceptance_rate}%`}
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatItem
          label="Rejetés"
          value={stats.total_rejected}
          icon={<Cancel />}
          color="#EF4444"
          subtitle={`${stats.rejection_rate}%`}
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatItem
          label="Publiés"
          value={stats.total_published}
          icon={<Publish />}
          color="#6366F1"
          subtitle={`${stats.publication_rate}%`}
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatItem
          label="Auteurs"
          value={stats.total_authors}
          icon={<Group />}
          color="#10B981"
        />
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(33.333% - 16px)' } }}>
        <StatItem
          label="Évaluateurs"
          value={stats.total_evaluators}
          icon={<RateReview />}
          color="#06B6D4"
        />
      </Box>
    </Box>
  );
}
