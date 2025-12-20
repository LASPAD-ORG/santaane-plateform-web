export interface ValidationError {
  field: string;
  message: string;
}

// Payload interface for creating/updating roles
export interface GestionRolesPayload {
  name: string;
  description?: string;
}

/**
 * Validate name field
 */
export function validateName(name: string): ValidationError | null {
  if (!name || name.trim().length === 0) {
    return { field: 'name', message: 'Le nom du rôle est requis' };
  }
  if (name.length < 3) {
    return { field: 'name', message: 'Le nom doit contenir au moins 3 caractères' };
  }
  if (name.length > 50) {
    return { field: 'name', message: 'Le nom ne doit pas dépasser 50 caractères' };
  }
  return null;
}

/**
 * Validate description field
 */
export function validateDescription(description?: string): ValidationError | null {
  if (description && description.length > 500) {
    return { field: 'description', message: 'La description ne doit pas dépasser 500 caractères' };
  }
  return null;
}

/**
 * Validate complete role payload
 */
export function validateGestionRoles(payload: GestionRolesPayload): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate name
  const nameError = validateName(payload.name);
  if (nameError) errors.push(nameError);

  // Validate description
  const descriptionError = validateDescription(payload.description);
  if (descriptionError) errors.push(descriptionError);

  return errors;
}

/**
 * Check if user can edit this role
 */
export function canEditGestionRoles(
  userRoles: string[]
): boolean {
  // Only super admins can manage roles
  return userRoles.includes('SUPER_ADMIN');
}

/**
 * Check if user can delete this role
 */
export function canDeleteGestionRoles(
  userRoles: string[]
): boolean {
  // Only super admins can manage roles
  return userRoles.includes('SUPER_ADMIN');
}

/**
 * Check if user can view roles
 */
export function canViewGestionRoles(
  userRoles: string[]
): boolean {
  return userRoles.includes('SUPER_ADMIN');
}
