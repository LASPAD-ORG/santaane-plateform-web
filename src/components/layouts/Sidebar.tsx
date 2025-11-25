'use client';

import { usePathname, useRouter } from 'next/navigation';
import {Drawer,List,ListItem, ListItemButton,ListItemIcon, ListItemText,Divider,Box,Typography,Avatar,ListSubheader} from '@mui/material';
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
        {user.roles.includes('super-admin') ? (
          // Menu organisé par catégories pour Super Admin
          <>
            {/* Tableau de Bord */}
            {menuItems.filter(item => item.path === '/dashboard/super-admin').map((item) => {
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
                    <ListItemText primary="🏠 Tableau de Bord" />
                  </ListItemButton>
                </ListItem>
              );
            })}

            {/* Administration */}
            {(() => {
              const adminItems = menuItems.filter(item => 
                item.path.includes('/gestion-utilisateurs') ||
                item.path.includes('/gestion-des-editeur') ||
                item.path.includes('/gestion-mentor') ||
                item.path.includes('/gestion-evaluateur')
              );
              return adminItems.length > 0 ? (
                <>
                  <ListSubheader component="div" sx={styles.categoryHeader}>
                    👥 Administration
                  </ListSubheader>
                  {adminItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;
                    const cleanLabel = item.label.replace(/^(Gestion\s+)/i, '');
                    return (
                      <ListItem key={item.path} disablePadding sx={styles.categoryItem}>
                        <ListItemButton
                          onClick={() => handleNavigation(item.path)}
                          sx={isActive ? styles.activeListItem : styles.listItemButton}
                        >
                          <ListItemIcon>
                            <Icon />
                          </ListItemIcon>
                          <ListItemText primary={cleanLabel} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </>
              ) : null;
            })()}

            {/* Supervision Contenu */}
            {(() => {
              const contentItems = menuItems.filter(item => 
                item.path.includes('/gestion-manuscrit') ||
                item.path.includes('/gestion-soummission') ||
                item.path.includes('/auteur-a-acompagner')
              );
              return contentItems.length > 0 ? (
                <>
                  <ListSubheader component="div" sx={styles.categoryHeader}>
                    📚 Supervision Contenu
                  </ListSubheader>
                  {contentItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;
                    let cleanLabel = item.label;
                    if (item.path.includes('/gestion-manuscrit')) cleanLabel = 'Manuscrits';
                    if (item.path.includes('/gestion-soummission')) cleanLabel = 'Soumissions';
                    if (item.path.includes('/auteur-a-acompagner')) cleanLabel = 'Mentorat';
                    return (
                      <ListItem key={item.path} disablePadding sx={styles.categoryItem}>
                        <ListItemButton
                          onClick={() => handleNavigation(item.path)}
                          sx={isActive ? styles.activeListItem : styles.listItemButton}
                        >
                          <ListItemIcon>
                            <Icon />
                          </ListItemIcon>
                          <ListItemText primary={cleanLabel} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </>
              ) : null;
            })()}

            {/* Système & Tests */}
            {(() => {
              const systemItems = menuItems.filter(item => 
                item.path.includes('/settings') ||
                item.path.includes('/test-page') ||
                item.path.includes('/analytics') ||
                item.path.includes('/test-composant')
              );
              return systemItems.length > 0 ? (
                <>
                  <ListSubheader component="div" sx={styles.categoryHeader}>
                    ⚙️ Système & Tests
                  </ListSubheader>
                  {systemItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;
                    let cleanLabel = item.label;
                    if (item.path.includes('/test-page')) cleanLabel = 'Tests & Debug';
                    if (item.path.includes('/test-composant')) cleanLabel = 'Test Composants';
                    return (
                      <ListItem key={item.path} disablePadding sx={styles.categoryItem}>
                        <ListItemButton
                          onClick={() => handleNavigation(item.path)}
                          sx={isActive ? styles.activeListItem : styles.listItemButton}
                        >
                          <ListItemIcon>
                            <Icon />
                          </ListItemIcon>
                          <ListItemText primary={cleanLabel} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </>
              ) : null;
            })()}
          </>
        ) : (
          // Menu standard pour les autres rôles
          menuItems.map((item) => {
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
          })
        )}
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
      overflowY: 'auto',
      overflowX: 'hidden',
      height: 'calc(100vh - 16px)', // Ajuste la hauteur pour le margin
      display: 'flex',
      flexDirection: 'column',
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
    overflowY: 'auto',
    minHeight: 0, // Important pour permettre le flex shrink
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
  categoryHeader: {
    bgcolor: 'transparent',
    color: 'text.secondary',
    fontWeight: 700,
    fontSize: '0.875rem',
    px: 2,
    py: 1.5,
    mt: 1.5,
    lineHeight: 1.2,
    textTransform: 'none',
    borderBottom: '1px solid',
    borderBottomColor: 'divider',
    position: 'sticky',
    top: 0,
    bgcolor: 'background.paper',
    zIndex: 1,
  },
  categoryItem: {
    mb: 0.5,
    pl: 1,
  },
};