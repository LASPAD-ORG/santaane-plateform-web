import { UserRole } from '@/types/auth';
import type { SvgIconTypeMap } from '@mui/material';
import type { OverridableComponent } from '@mui/material/OverridableComponent';
import {
  Adb as AdbIcon,
  Analytics as AnalyticsIcon,
  Article as ArticleIcon,
  Assignment as AssignmentIcon,
  Book,
  Business as BusinessIcon,
  Create as CreateIcon,
  Dashboard as DashboardIcon,
  Groups as GroupsIcon,
  Translate as TranslateIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  SupervisorAccount as SupervisorIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';

export type IconComponent = OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
  muiName: string;
};

export interface MenuItem {
  label: string;
  path: string;
  icon: IconComponent;
  roles: UserRole[];
  children?: MenuItem[];
}

export interface RoleConfig {
  role: UserRole;
  label: string;
  defaultRoute: string;
  color: string; // For UI display
}


export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {

  [UserRole.SUPER_ADMIN]: {
    role: UserRole.SUPER_ADMIN,
    label: 'Super Admin',
    defaultRoute: '/dashboard/super-admin',
    color: '#d32f2f', // Red
  },
  [UserRole.EDITOR]: {
    role: UserRole.EDITOR,
    label: 'Éditeur',
    defaultRoute: '/dashboard/editor',
    color: '#1976d2', // Blue
  },
  [UserRole.EVALUATOR]: {
    role: UserRole.EVALUATOR,
    label: 'Évaluateur',
    defaultRoute: '/dashboard/evaluator',
    color: '#7b1fa2', // Purple
  },
  [UserRole.AUTHOR]: {
    role: UserRole.AUTHOR,
    label: 'Auteur',
    defaultRoute: '/dashboard/author',
    color: '#f57c00', // Orange
  },
};

/**
 * Sidebar menu items with role-based access
 *
 * Menu structure by role:
 * - SUPER_ADMIN: Platform management, all laboratories, analytics
 * - EDITOR: Manage researchers, assign roles, lab settings
 * - AUTHOR: My articles, create article, profile
 */
export const MENU_ITEMS: MenuItem[] = [
  // ===== SUPER_ADMIN MENUS =====
  {
    label: 'Dashboard',
    path: '/dashboard/super-admin',
    icon: DashboardIcon,
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    label: 'Utilisateurs',
    path: '/dashboard/super-admin/gestion-utilisateurs',
    icon: PeopleIcon,
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    label:'Roles',
    path:'/dashboard/super-admin/gestion-roles',
    icon:SettingsIcon,
    roles:[UserRole.SUPER_ADMIN]
  },

  {
    label: 'Thèmes',
    path: '/dashboard/super-admin/gestion-theme',
    icon: SettingsIcon,
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    label: 'Rubriques',
    path: '/dashboard/super-admin/gestion-rubriques',
    icon: SettingsIcon,
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    label: 'Langues',
    path: '/dashboard/super-admin/langue',
    icon: SettingsIcon,
    roles: [UserRole.SUPER_ADMIN],
  },
  // ===== EDITOR MENUS =====
  {
    label: 'Dashboard',
    path: '/dashboard/editor',
    icon: DashboardIcon,
    roles: [UserRole.EDITOR],
  },
  {
    label: 'Manuscrits',
    path: '/dashboard/editor/manuscripts',
    icon: ArticleIcon,
    roles: [UserRole.EDITOR],
  },
  {
    label: 'Evaluateurs',
    path: '/dashboard/editor/evaluators',
    icon: PeopleIcon,
    roles: [UserRole.EDITOR],
  },

  // AUTHOR menus (base level - everyone has these)
  {
    label: 'Dashboard',
    path: '/dashboard/author',
    icon: DashboardIcon,
    roles: [UserRole.AUTHOR],
  },
  {
    label: 'Soumission',
    path: '/dashboard/author/soumission',
    icon: ArticleIcon,
    roles: [UserRole.AUTHOR],
  },
  {
    label: 'Manuscripts',
    path: '/dashboard/author/manuscripts',
    icon: ArticleIcon,
    roles: [UserRole.AUTHOR],
  },

  // Common Profile Menu Item
  {
    label: 'Profil',
    path: '/dashboard/profil',
    icon: AccountCircleIcon,
    roles: [UserRole.AUTHOR, UserRole.EDITOR, UserRole.EVALUATOR],
  },

    {
    label: 'Dashboard',
    path: '/dashboard/evaluator',
    icon: DashboardIcon,
    roles: [UserRole.EVALUATOR],
  },
     {
    label: 'Manuscrits',
    path: '/dashboard/evaluator/manuscripts',
    icon: DashboardIcon,
    roles: [UserRole.EVALUATOR],
  },
  

];

/**
 * Get menu items for a specific role
 */
export function getMenuItemsForRole(role: UserRole): MenuItem[] {
  return MENU_ITEMS.filter((item) => item.roles.includes(role));
}

/**
 * Get menu items for multiple roles (merge and deduplicate)
 * Preserves the order defined in MENU_ITEMS
 */
export function getMenuItemsForRoles(userRoles: UserRole[]): MenuItem[] {
  const allMenuItems = new Map<string, MenuItem>();

  // Process in the order of MENU_ITEMS to preserve menu order
  MENU_ITEMS.forEach(menuItem => {
    // Check if any of the user's roles can access this menu item
    const hasAccess = menuItem.roles.some(role => userRoles.includes(role));
    if (hasAccess) {
      allMenuItems.set(menuItem.path, menuItem);
    }
  });

  return Array.from(allMenuItems.values());
}

/**
 * Get default route for a user with multiple roles
 */
export function getDefaultRouteForRoles(userRoles: UserRole[]): string {
  // Priority order
  const priority = [
    UserRole.SUPER_ADMIN,
    UserRole.EDITOR,
    UserRole.EVALUATOR,
    UserRole.AUTHOR,
  ];

  for (const role of priority) {
    if (userRoles.includes(role)) {
      return ROLE_CONFIGS[role].defaultRoute;
    }
  }

  return '/dashboard/author'; // Fallback
}

/**
 * Get default route for a single role
 */
export function getDefaultRouteForRole(role: UserRole): string {
  return ROLE_CONFIGS[role]?.defaultRoute || '/dashboard/author';
}

/**
 * Check if user can access a route (single role)
 */
export function canAccessRoute(userRole: UserRole, path: string): boolean {
  // Find menu item for this path
  const menuItem = MENU_ITEMS.find((item) => item.path === path);

  if (!menuItem) {
    // If not in menu, check if it's a role-specific route
    return path.includes(ROLE_CONFIGS[userRole]?.defaultRoute);
  }

  return menuItem.roles.includes(userRole);
}

/**
 * Check if user can access a route (multiple roles)
 */
export function canAccessRouteWithRoles(userRoles: UserRole[], path: string): boolean {
  return userRoles.some(role => canAccessRoute(role, path));
}

/**
 * Get role label for display
 */
export function getRoleLabel(role: UserRole): string {
  return ROLE_CONFIGS[role]?.label || role;
}

/**
 * Get role color for display
 */
export function getRoleColor(role: UserRole): string {
  return ROLE_CONFIGS[role]?.color || '#757575';
}
