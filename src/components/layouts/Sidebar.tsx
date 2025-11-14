'use client';

import { usePathname, useRouter } from 'next/navigation';
import {Drawer,List,ListItem, ListItemButton,ListItemIcon, ListItemText,Divider,Box,Typography,Avatar} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuthStore } from '@/stores/authStore';
import { getMenuItemsForRoles, ROLE_CONFIGS } from '@/config/roles';

const DRAWER_WIDTH = 260;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const menuItems = user ? getMenuItemsForRoles(user.roles) : [];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (!user) return null;

  return (
    <Drawer
      variant="permanent"
      sx={styles.drawer}
    >
      {/* User Info Section */}
      <Box sx={styles.userBox}>
        <Avatar sx={styles.avatar}>{user.fullName.charAt(0).toUpperCase()}</Avatar>
        <Box sx={styles.userTextBox}>
          <Typography variant="subtitle1" fontWeight={600}>
            {user.fullName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.roles.map(role => ROLE_CONFIGS[role]?.label).filter(Boolean).join(', ')}
          </Typography>
        </Box>
      </Box>

      <Divider />

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
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={styles.logoutButton}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}

const styles = {
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: DRAWER_WIDTH,
      boxSizing: 'border-box',
      borderRadius: 4,
      m: 1,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      overflow: 'hidden',
    },
  },
  userBox: {
    p: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    bgcolor: 'secondary.main',
    borderRadius: 4,
    boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
  },
  userTextBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    flexGrow: 1,
    p: 1,
  },
  listItem: {
    mb: 1,
  },
  listItemButton: {
    borderRadius: 3,
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
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