import { UserStatus } from '../fetchers/useFetchGestionUtilisateurs';

export interface ValidationError {
  field: string;
  message: string;
}

// Payload interface for creating/updating gestion-utilisateurs
export interface GestionUtilisateursPayload {
  title: string;
  description?: string;
  status?: UserStatus;
  // Add more fields as needed
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
 * Validate complete gestion-utilisateurs payload
 */
export function validateGestionUtilisateurs(payload: GestionUtilisateursPayload): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate title
  const titleError = validateTitle(payload.title);
  if (titleError) errors.push(titleError);

  // Validate description
  const descriptionError = validateDescription(payload.description);
  if (descriptionError) errors.push(descriptionError);

  // Add more validations as needed

  return errors;
}

/**
 * Check if user can edit this gestion-utilisateurs
 */
export function canEditGestionUtilisateurs(
  itemOwnerId: string,
  currentUserId: string,
  userRoles: string[]
): boolean {
  // Super admins and editors can edit anything
  if (userRoles.includes('SUPER_ADMIN') || userRoles.includes('EDITOR')) {
    return true;
  }

  // Owners can edit their own items
  if (itemOwnerId === currentUserId) {
    return true;
  }

  return false;
}

/**
 * Check if user can delete this gestion-utilisateurs
 */
export function canDeleteGestionUtilisateurs(
  itemOwnerId: string,
  currentUserId: string,
  userRoles: string[]
): boolean {
  // Super admins and editors can delete anything
  if (userRoles.includes('SUPER_ADMIN') || userRoles.includes('EDITOR')) {
    return true;
  }

  // Owners can delete their own items
  if (itemOwnerId === currentUserId) {
    return true;
  }

  return false;
}

/**
 * Check if user can view this gestion-utilisateurs
 */
export function canViewGestionUtilisateurs(
  itemOwnerId: string,
  currentUserId: string,
  userRoles: string[]
): boolean {
  // All authenticated users can view (adjust based on your requirements)
  return true;
}
