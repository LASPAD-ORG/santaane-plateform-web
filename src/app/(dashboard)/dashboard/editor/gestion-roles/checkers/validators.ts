export interface ValidationError {
  field: string;
  message: string;
}

export interface RoleAssignmentPayload {
  userEmail: string;
  role: string;
  laboratoryId: string;
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

export function validateRole(role: string): ValidationError | null {
  const validRoles = [
    'SUPER_ADMIN',
    'EDITOR',
    'EVALUATOR',
    'MENTOR',
    'AUTHOR',
  ];

  if (!role || role.trim().length === 0) {
    return { field: 'role', message: 'Le rôle est requis' };
  }

  if (!validRoles.includes(role)) {
    return {
      field: 'role',
      message: 'Rôle invalide',
    };
  }

  return null;
}

export function validateLaboratoryId(laboratoryId: string): ValidationError | null {
  if (!laboratoryId || laboratoryId.trim().length === 0) {
    return { field: 'laboratoryId', message: 'Le laboratoire est requis' };
  }

  return null;
}

export function validateRoleAssignment(
  payload: RoleAssignmentPayload
): ValidationError[] {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(payload.userEmail);
  if (emailError) errors.push(emailError);

  const roleError = validateRole(payload.role);
  if (roleError) errors.push(roleError);

  const labError = validateLaboratoryId(payload.laboratoryId);
  if (labError) errors.push(labError);

  return errors;
}

export function canAssignRole(editorRole: string, targetRole: string): boolean {
  // Seul EDITOR et SUPER_ADMIN peuvent attribuer des rôles
  if (editorRole !== 'EDITOR' && editorRole !== 'SUPER_ADMIN') {
    return false;
  }

  // EDITOR ne peut attribuer que MENTOR, EVALUATOR, AUTHOR
  if (editorRole === 'EDITOR') {
    const allowedRoles = ['MENTOR', 'EVALUATOR', 'AUTHOR'];
    return allowedRoles.includes(targetRole);
  }

  // SUPER_ADMIN peut attribuer tous les rôles
  return true;
}

export function canDeactivateRole(editorRole: string): boolean {
  // Seul EDITOR et SUPER_ADMIN peuvent désactiver des attributions
  return editorRole === 'EDITOR' || editorRole === 'SUPER_ADMIN';
}

export function canViewRoleAssignments(userRole: string): boolean {
  // EDITOR et SUPER_ADMIN peuvent voir les attributions
  const allowedRoles = ['EDITOR', 'SUPER_ADMIN'];
  return allowedRoles.includes(userRole);
}

export function getRoleHierarchy(role: string): number {
  // Plus le nombre est élevé, plus le rôle a de permissions
  const hierarchy: Record<string, number> = {
    SUPER_ADMIN: 5,
    EDITOR: 4,
    EVALUATOR: 3,
    MENTOR: 2,
    AUTHOR: 1,
  };

  return hierarchy[role] || 0;
}

export function canAssignToLaboratory(
  editorLaboratoryId: string,
  targetLaboratoryId: string
): boolean {
  // Un éditeur ne peut assigner des rôles que dans son propre laboratoire
  return editorLaboratoryId === targetLaboratoryId;
}
