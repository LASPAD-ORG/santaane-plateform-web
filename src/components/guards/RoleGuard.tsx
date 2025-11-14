'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types/auth';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Block as BlockIcon } from '@mui/icons-material';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

/**
 * RoleGuard component to restrict access based on user roles
 */
export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  // Check if user has at least one of the allowed roles
  const hasAccess = user && user.roles.some(role => allowedRoles.includes(role));

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Show access denied message if user doesn't have required role
  if (!hasAccess) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 500,
            textAlign: 'center',
          }}
        >
          <BlockIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Accès Refusé
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Rôles requis : {allowedRoles.join(', ')}
            <br />
            Vos rôles : {user?.roles.join(', ') || 'Non défini'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/dashboard')}
            sx={{ mt: 2 }}
          >
            Retour au Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return <>{children}</>;
}
