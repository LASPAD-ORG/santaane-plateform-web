'use client';

import { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Sidebar from '@/components/layouts/Sidebar';
import AuthGuard from '@/components/guards/AuthGuard';

const DRAWER_WIDTH = 260;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AuthGuard>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Mobile AppBar */}
        {/* Mobile AppBar */}
        <AppBar
          position="fixed"
          sx={{
            display: { xs: 'block', md: 'none' },
            width: '100%',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Global Africa Journal
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar Navigation */}
        <Sidebar mobileOpen={mobileOpen} onMobileToggle={handleDrawerToggle} />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            width: {
              xs: '100%',
              md: `calc(100% - ${DRAWER_WIDTH}px)`,
            },
            minHeight: '100vh',
            bgcolor: 'background.default',
            // Add top padding on mobile for AppBar, plus extra spacing
            pt: { xs: '80px', sm: '88px', md: '24px' },
            px: { xs: 2, md: 2.5, lg: 3 },
            pb: { xs: 3, sm: 4 },
          }}
        >
          {children}
        </Box>
      </Box>
    </AuthGuard>
  );
}
