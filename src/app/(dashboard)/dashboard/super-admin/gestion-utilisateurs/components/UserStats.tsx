'use client';

import {
  Grid,
  Paper,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Block as BlockIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { UserStats as UserStatsType } from '../types';
import { UserRole } from '@/types/auth';
import { ROLE_CONFIGS } from '@/config/roles';

interface UserStatsProps {
  stats: UserStatsType;
  loading: boolean;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  loading?: boolean;
}

function StatCard({ title, value, icon, color, subtitle, loading }: StatCardProps) {
  return (
    <Paper sx={{ p: 3, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${color}, ${color}80)`,
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Box sx={{ color, mr: 1 }}>{icon}</Box>
        <Typography variant="h6" component="h3">
          {title}
        </Typography>
      </Box>

      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <>
          <Typography variant="h3" component="p" sx={{ color, fontWeight: 'bold', mb: 1 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </>
      )}
    </Paper>
  );
}

export function UserStats({ stats, loading }: UserStatsProps) {
  const roleEntries = Object.entries(stats.byRole).filter(([_, count]) => count > 0);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Statistiques des utilisateurs
      </Typography>

      <Grid container spacing={3}>
        {/* Stats principales */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Utilisateurs"
            value={stats.total}
            icon={<PeopleIcon />}
            color="#1976d2"
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Actifs"
            value={stats.active}
            icon={<CheckCircleIcon />}
            color="#388e3c"
            subtitle={`${((stats.active / stats.total) * 100).toFixed(0)}% du total`}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="En attente"
            value={stats.pending}
            icon={<WarningIcon />}
            color="#f57c00"
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Suspendus"
            value={stats.suspended}
            icon={<BlockIcon />}
            color="#d32f2f"
            loading={loading}
          />
        </Grid>

        {/* Stats par période */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Nouveaux ce mois"
            value={stats.newThisMonth}
            icon={<PersonAddIcon />}
            color="#7b1fa2"
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Actifs cette semaine"
            value={stats.activeThisWeek}
            icon={<TrendingUpIcon />}
            color="#00796b"
            loading={loading}
          />
        </Grid>

        {/* Stats par rôle */}
        {roleEntries.map(([role, count]) => (
          <Grid key={role} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title={ROLE_CONFIGS[role as UserRole]?.label || role}
              value={count}
              icon={<PeopleIcon />}
              color={ROLE_CONFIGS[role as UserRole]?.color || '#757575'}
              subtitle={`${((count / stats.total) * 100).toFixed(1)}% du total`}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}