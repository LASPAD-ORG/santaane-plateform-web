'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
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

const DRAWER_WIDTH = 280;

// ─── Design tokens ───
const TOKEN = {
  black: '#0a0a0a',
  white: '#ffffff',
  offWhite: '#f5f4f0',
  gray100: '#f0efeb',
  gray300: '#d4d2cc',
  gray500: '#8a887f',
  gray700: '#3d3c38',
  gold: '#b8953a',
  goldDim: 'rgba(184,149,58,0.08)',
};
const fontSans = '"Noto Sans", sans-serif';

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
    if (isMobile) onMobileToggle();
  };

  if (!user) return null;

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: TOKEN.white,
      }}
    >
      {/* ─── Logo ─── */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: `1px solid ${TOKEN.gray100}`,
        }}
      >
        <Image
          src="/images/02-GA-Site-Page-Noir.gif"
          alt="Logo Global Africa Journal"
          width={160}
          height={50}
          style={{ objectFit: 'contain' }}
          priority
        />
      </Box>

      {/* ─── User profile ─── */}
      <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            width: 42,
            height: 42,
            bgcolor: TOKEN.black,
            color: TOKEN.white,
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 700,
            fontFamily: fontSans,
            flexShrink: 0,
          }}
        >
          {user.fullName.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            noWrap
            sx={{ fontFamily: fontSans, fontSize: '0.875rem', letterSpacing: '-0.01em', color: TOKEN.black }}
          >
            {user.fullName}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontFamily: fontSans, color: TOKEN.gray500, fontWeight: 500, fontSize: '0.72rem', letterSpacing: '0.01em' }}
          >
            {user.roles.map((role) => ROLE_CONFIGS[role]?.label).filter(Boolean).join(' · ')}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: TOKEN.gray100 }} />

      {/* ─── Navigation ─── */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, py: 2 }}>
        <Typography
          variant="overline"
          sx={{
            px: 2,
            mb: 1.5,
            display: 'block',
            fontFamily: fontSans,
            color: TOKEN.gray500,
            fontWeight: 700,
            fontSize: '0.62rem',
            letterSpacing: '0.12em',
          }}
        >
          MENU PRINCIPAL
        </Typography>
        <List disablePadding>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: '6px',
                    py: 1.1,
                    px: 2,
                    position: 'relative',
                    transition: 'all 0.15s ease',
                    bgcolor: isActive ? TOKEN.goldDim : 'transparent',
                    border: `1px solid ${isActive ? TOKEN.gold + '44' : 'transparent'}`,
                    color: isActive ? TOKEN.black : TOKEN.gray500,
                    '&:hover': {
                      bgcolor: isActive ? TOKEN.goldDim : TOKEN.gray100,
                      color: TOKEN.black,
                      border: `1px solid ${isActive ? TOKEN.gold + '44' : TOKEN.gray300}`,
                    },
                  }}
                >
                  {/* Active left bar */}
                  {isActive && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: '25%',
                        height: '50%',
                        width: '3px',
                        borderRadius: '0 2px 2px 0',
                        bgcolor: TOKEN.gold,
                      }}
                    />
                  )}
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? TOKEN.gold : TOKEN.gray500,
                      transition: '0.15s',
                    }}
                  >
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontFamily: fontSans,
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? TOKEN.black : TOKEN.gray700,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: TOKEN.gray100 }} />

      {/* ─── Logout ─── */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '6px',
            py: 1.1,
            px: 2,
            color: TOKEN.gray500,
            border: `1px solid transparent`,
            transition: 'all 0.15s ease',
            '&:hover': {
              bgcolor: 'rgba(211,47,47,0.05)',
              color: '#c62828',
              borderColor: 'rgba(211,47,47,0.2)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Déconnexion"
            primaryTypographyProps={{
              fontFamily: fontSans,
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'inherit',
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box component="nav">
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: TOKEN.white,
            borderRight: `1px solid ${TOKEN.gray300}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: TOKEN.white,
            borderRight: `1px solid ${TOKEN.gray300}`,
            height: 'calc(100vh - 32px)',
            m: 2,
            borderRadius: '12px',
            boxShadow: `0 2px 16px rgba(0,0,0,0.06)`,
            overflow: 'hidden',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}