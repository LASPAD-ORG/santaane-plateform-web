'use client';

import { Box, Toolbar } from '@mui/material';
import Sidebar from '@/components/layouts/Sidebar';
import AuthGuard from '@/components/guards/AuthGuard';

const DRAWER_WIDTH = 260;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Box sx={{ display: 'flex' }}>
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
            minHeight: '100vh',
            bgcolor: 'background.default',
          }}
        >
          {children}
        </Box>
      </Box>
    </AuthGuard>
  );
}
