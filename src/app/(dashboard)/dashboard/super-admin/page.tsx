'use client';

import { Box } from '@mui/material';
import PageHeader from '@/components/ui/PageHeader';
import SuperAdminDashboardContent from './components/SuperAdminDashboardContent';

export default function SuperAdminDashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <PageHeader title="Tableau de bord super admin" />
      <SuperAdminDashboardContent />
    </Box>
  );
}