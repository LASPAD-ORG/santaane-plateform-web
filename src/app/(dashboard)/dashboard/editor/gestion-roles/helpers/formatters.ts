export function formatRoleDate(dateString?: string): string {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getRoleLabel(role: string): string {
  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    EDITOR: 'Éditeur',
    EVALUATOR: 'Évaluateur',
    MENTOR: 'Mentor',
    AUTHOR: 'Auteur',
  };

  return roleLabels[role] || role;
}

export function getRoleColor(
  role: string
): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  const roleColors: Record<string, any> = {
    SUPER_ADMIN: 'error',
    EDITOR: 'primary',
    EVALUATOR: 'info',
    MENTOR: 'success',
    AUTHOR: 'secondary',
  };

  return roleColors[role] || 'default';
}

export function getRoleDescription(role: string): string {
  const descriptions: Record<string, string> = {
    SUPER_ADMIN:
      'Accès complet à la plateforme, gestion de tous les utilisateurs et laboratoires',
    EDITOR:
      'Gestion des manuscrits, attribution des mentors et évaluateurs, décisions éditoriales',
    EVALUATOR:
      'Évaluation des manuscrits, rédaction de rapports d\'évaluation, recommandations',
    MENTOR:
      'Accompagnement des auteurs, conseils méthodologiques, révision des brouillons',
    AUTHOR:
      'Soumission de manuscrits, révision suite aux retours, publication',
  };

  return descriptions[role] || 'Rôle sans description';
}

export function getActiveStatusLabel(isActive: boolean): string {
  return isActive ? 'Actif' : 'Inactif';
}

export function getActiveStatusColor(
  isActive: boolean
): 'success' | 'default' {
  return isActive ? 'success' : 'default';
}

export function formatUserName(fullName: string, email: string): string {
  return fullName || email.split('@')[0];
}

export function getUserInitials(fullName: string): string {
  if (!fullName) return '?';

  const parts = fullName.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
}

export function truncateEmail(email: string, maxLength: number = 30): string {
  if (email.length <= maxLength) return email;

  const [localPart, domain] = email.split('@');
  const maxLocalLength = maxLength - domain.length - 4; // 4 for "...@"

  if (localPart.length > maxLocalLength) {
    return `${localPart.substring(0, maxLocalLength)}...@${domain}`;
  }

  return email;
}

export function formatAssignmentDuration(assignedAt: string): string {
  const assigned = new Date(assignedAt);
  const now = new Date();
  const diffTime = now.getTime() - assigned.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Il y a 1 jour';
  if (diffDays < 30) return `Il y a ${diffDays} jours`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Il y a ${months} mois`;
  }

  const years = Math.floor(diffDays / 365);
  return `Il y a ${years} an${years > 1 ? 's' : ''}`;
}

export function countActiveAssignments(
  assignments: any[],
  role?: string
): number {
  return assignments.filter((a) => {
    if (!a.isActive) return false;
    if (role && a.role !== role) return false;
    return true;
  }).length;
}

export function groupAssignmentsByRole(assignments: any[]): Record<string, any[]> {
  const grouped: Record<string, any[]> = {
    SUPER_ADMIN: [],
    EDITOR: [],
    EVALUATOR: [],
    MENTOR: [],
    AUTHOR: [],
  };

  assignments.forEach((assignment) => {
    if (grouped[assignment.role]) {
      grouped[assignment.role].push(assignment);
    }
  });

  return grouped;
}

export function sortAssignmentsByDate(
  assignments: any[],
  order: 'asc' | 'desc' = 'desc'
): any[] {
  return [...assignments].sort((a, b) => {
    const dateA = new Date(a.assignedAt).getTime();
    const dateB = new Date(b.assignedAt).getTime();

    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}
