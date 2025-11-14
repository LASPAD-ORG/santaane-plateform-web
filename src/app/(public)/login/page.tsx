"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Paper, CircularProgress } from '@mui/material';
import LoginForm from './components/LoginForm';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  // Check authentication status on mount (client-side only)
  useEffect(() => {
    const checkAuthentication = async () => {
      await checkAuth();
      setIsChecking(false);
    };

    checkAuthentication();
  }, [checkAuth]);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isChecking && user) {
      router.replace('/dashboard');
    }
  }, [user, isChecking, router]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Don't render login form if already authenticated
  if (user) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <LoginForm />
        </Paper>
      </Container>
    </Box>
  );
}
