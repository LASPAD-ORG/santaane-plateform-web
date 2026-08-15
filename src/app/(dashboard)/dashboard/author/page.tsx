'use client';

import { Box } from '@mui/material';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import PageHeader from '@/components/ui/PageHeader';
import AuthorDashboardContent from './components/AuthorDashboardContent';

export default function AuthorDashboard() {
  const { user } = useAuthStore();
  return (
    <RoleGuard allowedRoles={[UserRole.AUTHOR]}>
      <Box>
        <PageHeader title={`Bienvenue, ${user?.fullName}`} subtitle="Tableau de bord auteur" />
        <AuthorDashboardContent />
      </Box>
    </RoleGuard>
  );
}