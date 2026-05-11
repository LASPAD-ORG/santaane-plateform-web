'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { getDefaultRouteForRoles } from '@/config/roles';
import { Box, CircularProgress } from '@mui/material';

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  useEffect(() => {
    // Ne rediriger QUE si on est exactement sur /dashboard
    if (pathname !== '/dashboard') return;

    if (user && user.roles.length > 0) {
      const defaultRoute = getDefaultRouteForRoles(user.roles);
      router.replace(defaultRoute);
    }
  }, [user, router, pathname]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <CircularProgress />
    </Box>
  );
}
