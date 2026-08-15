'use client';

import { Box } from '@mui/material';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import PageHeader from '@/components/ui/PageHeader';
import EvaluatorDashboardContent from './components/EvaluatorDashboardContent';

export default function EvaluatorDashboard() {
  const { user } = useAuthStore();
  return (
    <RoleGuard allowedRoles={[UserRole.EVALUATOR]}>
      <Box>
        <PageHeader title={`Bienvenue, ${user?.fullName}`} subtitle="Tableau de bord évaluateur" />
        <EvaluatorDashboardContent />
      </Box>
    </RoleGuard>
  );
}