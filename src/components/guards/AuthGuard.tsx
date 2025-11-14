'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Box, CircularProgress } from '@mui/material';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component to protect routes that require authentication
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [hasChecked, setHasChecked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Mark component as mounted to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check authentication only once on mount
  useEffect(() => {
    if (isMounted && !hasChecked) {
      checkAuth().finally(() => setHasChecked(true));
    }
  }, [isMounted, hasChecked, checkAuth]);

  // Redirect to login if not authenticated after check is complete
  useEffect(() => {
    if (hasChecked && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [hasChecked, isAuthenticated, isLoading, router]);

  // Avoid hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return null;
  }

  // Show loading spinner while checking authentication
  if (!hasChecked || isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Render children only if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
