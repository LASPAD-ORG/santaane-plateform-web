export interface ValidationError {
  field: string;
  message: string;
}

// Payload interface for creating/updating themes
export interface GestionThemePayload {
  title: string;
  description?: string;
}

/**
 * Validate title field
 */
export function validateTitle(title: string): ValidationError | null {
  if (!title || title.trim().length === 0) {
    return { field: 'title', message: 'Le titre est requis' };
  }
  if (title.length < 3) {
    return { field: 'title', message: 'Le titre doit contenir au moins 3 caractères' };
  }
  if (title.length > 200) {
    return { field: 'title', message: 'Le titre ne doit pas dépasser 200 caractères' };
  }
  return null;
}

/**
 * Validate description field
 */
export function validateDescription(description?: string): ValidationError | null {
  if (description && description.length > 1000) {
    return { field: 'description', message: 'La description ne doit pas dépasser 1000 caractères' };
  }
  return null;
}

/**
 * Validate complete theme payload
 */
export function validateGestionTheme(payload: GestionThemePayload): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate title
  const titleError = validateTitle(payload.title);
  if (titleError) errors.push(titleError);

  // Validate description
  const descriptionError = validateDescription(payload.description);
  if (descriptionError) errors.push(descriptionError);

  return errors;
}

/**
 * Check if user can edit themes
 */
export function canEditGestionTheme(
  userRoles: string[]
): boolean {
  // Only super admins can manage themes
  return userRoles.includes('SUPER_ADMIN');
}

/**
 * Check if user can delete themes
 */
export function canDeleteGestionTheme(
  userRoles: string[]
): boolean {
  // Only super admins can manage themes
  return userRoles.includes('SUPER_ADMIN');
}

/**
 * Check if user can view themes
 */
export function canViewGestionTheme(
  userRoles: string[]
): boolean {
  return userRoles.includes('SUPER_ADMIN');
}
