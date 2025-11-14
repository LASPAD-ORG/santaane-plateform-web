'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { getDefaultRouteForRoles } from '@/config/roles';
import { Box, CircularProgress } from '@mui/material';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && user.roles.length > 0) {
      // Redirect based on role priority: SUPER_ADMIN > EDITOR > EVALUATOR > MENTOR > AUTHOR
      const defaultRoute = getDefaultRouteForRoles(user.roles);
      router.replace(defaultRoute);
    }
  }, [user, router]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
}
