'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuthStore } from '@/stores/authStore';
import { getMenuItemsForRoles, ROLE_CONFIGS } from '@/config/roles';

const DRAWER_WIDTH = 260;

interface SidebarProps {
  mobileOpen: boolean;
  onMobileToggle: () => void;
}

export default function Sidebar({ mobileOpen, onMobileToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuthStore();

  const menuItems = user ? getMenuItemsForRoles(user.roles) : [];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    // Close drawer on mobile after navigation
    if (isMobile) {
      onMobileToggle();
    }
  };

  if (!user) return null;

  // Shared drawer content
  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* User Info Section */}
      <Box sx={styles.userBox}>
        <Avatar sx={styles.avatar}>{user.fullName.charAt(0).toUpperCase()}</Avatar>
        <Box sx={styles.userTextBox}>
          <Typography variant="subtitle1" fontWeight={600} noWrap>
            {user.fullName}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user.roles.map((role) => ROLE_CONFIGS[role]?.label).filter(Boolean).join(', ')}
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Menu Items - Scrollable */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <List sx={styles.list}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <ListItem key={item.path} disablePadding sx={styles.listItem}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={isActive ? styles.activeListItem : styles.listItemButton}
                >
                  <ListItemIcon sx={styles.listItemIcon}>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider />

      {/* Logout Button */}
      <Box sx={styles.logoutContainer}>
        <ListItemButton onClick={handleLogout} sx={styles.logoutButton}>
          <ListItemIcon sx={styles.listItemIcon}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box component="nav">
      {/* Mobile Drawer (Temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRadius: 4,
            m: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            height: 'calc(100vh - 16px)',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

const styles = {
  userBox: {
    p: { xs: 1.5, sm: 2 },
    display: 'flex',
    alignItems: 'center',
    gap: { xs: 1, sm: 2 },
    flexShrink: 0,
  },
  avatar: {
    width: { xs: 48, sm: 64 },
    height: { xs: 48, sm: 64 },
    bgcolor: 'secondary.main',
    borderRadius: 4,
    boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
  },
  userTextBox: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0, // Allow text truncation
    flex: 1,
  },
  list: {
    p: { xs: 0.5, sm: 1 },
  },
  listItem: {
    mb: 0.5,
  },
  listItemButton: {
    borderRadius: 3,
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
  },
  listItemIcon: {
    minWidth: { xs: 40, sm: 48 },
  },
  activeListItem: {
    borderRadius: 3,
    bgcolor: 'secondary.main',
    color: 'primary.contrastText',
    boxShadow: '0 3px 12px rgba(0,0,0,0.2)',
    '&:hover': {
      bgcolor: 'secondary.main',
    },
    '& .MuiListItemIcon-root': {
      color: 'secondary.contrastText',
    },
  },
  logoutContainer: {
    p: { xs: 1, sm: 2 },
    flexShrink: 0,
  },
  logoutButton: {
    borderRadius: 3,
    '&:hover': {
      bgcolor: 'error.light',
      color: 'error.contrastText',
      '& .MuiListItemIcon-root': {
        color: 'error.contrastText',
      },
      boxShadow: '0 4px 14px rgba(255,0,0,0.3)',
    },
  },
};
