export interface ValidationError {
  field: string;
  message: string;
}

export function validateFullName(fullName: string): ValidationError | null {
  if (!fullName || fullName.trim().length === 0) {
    return { field: 'fullName', message: 'Le nom complet est requis' };
  }

  if (fullName.length < 3) {
    return {
      field: 'fullName',
      message: 'Le nom doit contenir au moins 3 caractères',
    };
  }

  return null;
}

export function validateEmail(email: string): ValidationError | null {
  if (!email || email.trim().length === 0) {
    return { field: 'email', message: "L'email est requis" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: 'email', message: "Format d'email invalide" };
  }

  return null;
}

export function validateOrcidId(orcidId?: string): ValidationError | null {
  if (!orcidId) return null;

  // ORCID format: 0000-0002-1825-0097
  const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/;
  if (!orcidRegex.test(orcidId)) {
    return {
      field: 'orcidId',
      message: "Format ORCID invalide (attendu: 0000-0002-1825-0097)",
    };
  }

  return null;
}

export function canViewChercheur(userRole: string): boolean {
  // Éditeurs et super admins peuvent voir les chercheurs
  const allowedRoles = ['EDITOR', 'SUPER_ADMIN'];
  return allowedRoles.includes(userRole);
}

export function canEditChercheur(userRole: string): boolean {
  // Seuls les éditeurs et super admins peuvent modifier les profils
  return userRole === 'EDITOR' || userRole === 'SUPER_ADMIN';
}

export function canDeactivateChercheur(userRole: string): boolean {
  // Seul le super admin peut désactiver des comptes
  return userRole === 'SUPER_ADMIN';
}

export function hasMultipleRoles(roles: string[]): boolean {
  return roles.length > 1;
}

export function getPrimaryRole(roles: string[]): string {
  // Priorité: MENTOR > EVALUATOR > AUTHOR
  if (roles.includes('MENTOR')) return 'MENTOR';
  if (roles.includes('EVALUATOR')) return 'EVALUATOR';
  if (roles.includes('AUTHOR')) return 'AUTHOR';
  return roles[0] || 'AUTHOR';
}

export function isProductiveChercheur(
  manuscriptCount: number,
  reviewCount: number
): boolean {
  // Considéré comme productif s'il a au moins 2 manuscrits ou 3 évaluations
  return manuscriptCount >= 2 || reviewCount >= 3;
}

export function getChercheurStatus(
  isActive: boolean,
  emailVerified: boolean
): string {
  if (!isActive) return 'Inactif';
  if (!emailVerified) return 'Email non vérifié';
  return 'Actif';
}
