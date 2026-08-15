'use client';

import { Box } from '@mui/material';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import PageHeader from '@/components/ui/PageHeader';
import EditorDashboardContent from './components/EditorDashboardContent';

export default function EditorDashboard() {
  const { user } = useAuthStore();
  return (
    <RoleGuard allowedRoles={[UserRole.EDITOR]}>
      <Box>
        <PageHeader title={`Bienvenue, ${user?.fullName}`} subtitle="Tableau de bord editeur" />
        <EditorDashboardContent />
      </Box>
    </RoleGuard>
  );
}
