'use client';

import { Box } from '@mui/material';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import PageHeader from '@/components/ui/PageHeader';
import InternalEvaluatorDashboardContent from './components/InternalEvaluatorDashboardContent';

export default function InternalEvaluatorDashboard() {
  const { user } = useAuthStore();
  return (
    <RoleGuard allowedRoles={[UserRole.INTERNAL_EVALUATOR]}>
      <Box>
        <PageHeader title={`Bienvenue, ${user?.fullName}`} subtitle="Tableau de bord évaluateur interne" />
        <InternalEvaluatorDashboardContent />
      </Box>
    </RoleGuard>
  );
}