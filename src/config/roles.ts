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
  Mail,
  People as PeopleIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  SupervisorAccount as SupervisorIcon,
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

/**
 * Role configuration with default routes
 *
 * Role hierarchy (for shared dashboard):
 * - EVALUATOR can do: AUTHOR + MENTOR + EVALUATOR features
 * - MENTOR can do: AUTHOR + MENTOR features
 * - AUTHOR can do: AUTHOR features only
 *
 * SUPER_ADMIN and EDITOR have completely separate dashboards
 */
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
    defaultRoute: '/dashboard/shared',
    color: '#7b1fa2', // Purple
  },
  [UserRole.MENTOR]: {
    role: UserRole.MENTOR,
    label: 'Mentor',
    defaultRoute: '/dashboard/shared',
    color: '#388e3c', // Green
  },
  [UserRole.AUTHOR]: {
    role: UserRole.AUTHOR,
    label: 'Auteur',
    defaultRoute: '/dashboard/shared',
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
 * - MENTOR: AUTHOR menus + mentoring features
 * - EVALUATOR: AUTHOR + MENTOR menus + evaluation features
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
    label: 'Gestion utilisateurs',
    path: '/dashboard/super-admin/gestion-utilisateurs',
    icon: SettingsIcon,
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    label: 'Gestion des Poulets',
    path: '/dashboard/editor/gestion-poulet',
    icon: AdbIcon,
    roles: [UserRole.EDITOR, UserRole.AUTHOR],
  },

  // ===== EDITOR MENUS =====
  {
    label: 'Dashboard Labo',
    path: '/dashboard/editor',
    icon: DashboardIcon,
    roles: [UserRole.EDITOR],
  },
  {
    label: 'Chercheurs',
    path: '/dashboard/editor/researchers',
    icon: GroupsIcon,
    roles: [UserRole.EDITOR],
  },

  // ===== SHARED DASHBOARD MENUS (AUTHOR/MENTOR/EVALUATOR) =====

  // AUTHOR menus (base level - everyone has these)
  {
    label: 'Dashboard',
    path: '/dashboard/shared',
    icon: DashboardIcon,
    roles: [UserRole.AUTHOR, UserRole.MENTOR, UserRole.EVALUATOR],
  },
  {
    label: 'Mes Articles',
    path: '/dashboard/articles',
    icon: ArticleIcon,
    roles: [UserRole.AUTHOR, UserRole.EVALUATOR],
  },
  {
    label: 'Créer un Article',
    path: '/dashboard/articles/create',
    icon: CreateIcon,
    roles: [UserRole.AUTHOR, UserRole.EVALUATOR],
  },
  {
    label: 'Mon Profil',
    path: '/dashboard/profile',
    icon: PeopleIcon,
    roles: [UserRole.AUTHOR, UserRole.MENTOR, UserRole.EVALUATOR],
  },

  // MENTOR menus (AUTHOR + MENTOR features)
  {
    label: 'Mes Mentorats',
    path: '/dashboard/mentoring',
    icon: SchoolIcon,
    roles: [UserRole.AUTHOR, UserRole.EVALUATOR],
  },
  // EVALUATOR menus (AUTHOR + MENTOR + EVALUATOR features)
  {
    label: 'Évaluations',
    path: '/dashboard/evaluations',
    icon: AssignmentIcon,
    roles: [UserRole.EVALUATOR],
  },
  {
    label: 'Articles à Évaluer',
    path: '/dashboard/evaluations/pending',
    icon: AssignmentIcon,
    roles: [UserRole.EVALUATOR],
  },
  {
    label: 'Gestion des doucourer',
    path: '/dashboard/shared/author/gestion-des-doucourer',
    icon: SettingsIcon,
    roles: [UserRole.AUTHOR],
  },
  {
    label: 'Gestion soummission',
    path: '/dashboard/shared/author/gestion-soummission',
    icon: SettingsIcon,
    roles: [UserRole.EDITOR, UserRole.EVALUATOR, UserRole.AUTHOR],
  },
  {
    label: 'Gestion manuscrit',
    path: '/dashboard/shared/author/gestion-manuscrit',
    icon: SettingsIcon,
    roles: [UserRole.MENTOR, UserRole.AUTHOR],
  },
  {
    label: 'Mes auteurs',
    path: '/dashboard/mentor/auteur-a-acompagner',
    icon: SettingsIcon,
    roles: [UserRole.MENTOR],
  },
  {
    label: 'Parametrage revue',
    path: '/dashboard/super-admin/parametrage-revue',
    icon: SettingsIcon,
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    label: 'Gestion volume',
    path: '/dashboard/super-admin/gestion-volumes',
    icon: SettingsIcon,
    roles: [UserRole.SUPER_ADMIN],
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
 * Priority: SUPER_ADMIN > EDITOR > EVALUATOR > MENTOR > AUTHOR
 */
export function getDefaultRouteForRoles(userRoles: UserRole[]): string {
  // Priority order
  const priority = [
    UserRole.SUPER_ADMIN,
    UserRole.EDITOR,
    UserRole.EVALUATOR,
    UserRole.MENTOR,
    UserRole.AUTHOR,
  ];

  for (const role of priority) {
    if (userRoles.includes(role)) {
      return ROLE_CONFIGS[role].defaultRoute;
    }
  }

  return '/dashboard/shared'; // Fallback
}

/**
 * Get default route for a single role
 */
export function getDefaultRouteForRole(role: UserRole): string {
  return ROLE_CONFIGS[role]?.defaultRoute || '/dashboard/shared';
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
