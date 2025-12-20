export function formatUtilisateurDate(dateString?: string): string {
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

export function getUserInitials(fullName: string): string {
  if (!fullName) return '?';

  const parts = fullName.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
}

export function formatRolesList(roles: string[]): string {
  if (roles.length === 0) return 'Aucun rôle';
  if (roles.length === 1) return getRoleLabel(roles[0]);

  const labels = roles.map(getRoleLabel);
  return labels.join(', ');
}

export function getAccountAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Inscrit aujourd'hui";
  if (diffDays === 1) return 'Inscrit il y a 1 jour';
  if (diffDays < 30) return `Inscrit il y a ${diffDays} jours`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `Inscrit il y a ${diffMonths} mois`;
  }

  const diffYears = Math.floor(diffDays / 365);
  return `Inscrit il y a ${diffYears} an${diffYears > 1 ? 's' : ''}`;
}

export function getProductivityLabel(
  manuscriptCount: number,
  reviewCount: number
): string {
  const total = manuscriptCount + reviewCount;

  if (total === 0) return 'Nouveau';
  if (total < 3) return 'Peu actif';
  if (total < 6) return 'Actif';
  if (total < 10) return 'Très actif';
  return 'Hautement productif';
}

export function getProductivityColor(
  manuscriptCount: number,
  reviewCount: number
): 'default' | 'info' | 'primary' | 'success' {
  const total = manuscriptCount + reviewCount;

  if (total === 0) return 'default';
  if (total < 3) return 'info';
  if (total < 6) return 'primary';
  return 'success';
}

export function formatStatsSummary(
  manuscriptCount: number,
  reviewCount: number,
  mentorshipCount: number
): string {
  const parts: string[] = [];

  if (manuscriptCount > 0) {
    parts.push(`${manuscriptCount} manuscrit${manuscriptCount > 1 ? 's' : ''}`);
  }

  if (reviewCount > 0) {
    parts.push(`${reviewCount} évaluation${reviewCount > 1 ? 's' : ''}`);
  }

  if (mentorshipCount > 0) {
    parts.push(`${mentorshipCount} mentorat${mentorshipCount > 1 ? 's' : ''}`);
  }

  if (parts.length === 0) return 'Aucune activité';

  return parts.join(' • ');
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

export function sortUtilisateursByActivity(utilisateurs: any[]): any[] {
  return [...utilisateurs].sort((a, b) => {
    const activityA = a.manuscriptCount + a.reviewCount + a.mentorshipCount;
    const activityB = b.manuscriptCount + b.reviewCount + b.mentorshipCount;

    return activityB - activityA;
  });
}

export function sortUtilisateursByName(utilisateurs: any[]): any[] {
  return [...utilisateurs].sort((a, b) => {
    return a.fullName.localeCompare(b.fullName, 'fr');
  });
}

export function filterUtilisateursByRole(
  utilisateurs: any[],
  role: string
): any[] {
  return utilisateurs.filter((c) => c.roles.includes(role));
}

export function groupUtilisateursByLaboratory(
  utilisateurs: any[]
): Record<string, any[]> {
  const grouped: Record<string, any[]> = {};

  utilisateurs.forEach((utilisateur) => {
    const labName = utilisateur.laboratoryName;
    if (!grouped[labName]) {
      grouped[labName] = [];
    }
    grouped[labName].push(utilisateur);
  });

  return grouped;
}

export function getEmailVerificationStatus(emailVerified: boolean): string {
  return emailVerified ? 'Vérifié' : 'Non vérifié';
}

export function getActiveStatusLabel(isActive: boolean): string {
  return isActive ? 'Actif' : 'Inactif';
}
