export interface ValidationError {
  field: string;
  message: string;
}

// Payload interface for creating/updating sections
export interface GestionRubriquesPayload {
  name: string;
  signe_min: number;
  signe_max: number;
}

/**
 * Validate name field
 */
export function validateName(name: string): ValidationError | null {
  if (!name || name.trim().length === 0) {
    return { field: 'name', message: 'Le nom est requis' };
  }
  if (name.length < 3) {
    return { field: 'name', message: 'Le nom doit contenir au moins 3 caractères' };
  }
  if (name.length > 200) {
    return { field: 'name', message: 'Le nom ne doit pas dépasser 200 caractères' };
  }
  return null;
}

/**
 * Validate signe_min field
 */
export function validateSigneMin(signe_min: number): ValidationError | null {
  if (isNaN(signe_min) || signe_min < 1) {
    return { field: 'signe_min', message: 'Le signe minimum doit être un nombre positif' };
  }
  if (signe_min > 100) {
    return { field: 'signe_min', message: 'Le signe minimum ne doit pas dépasser 100' };
  }
  return null;
}

/**
 * Validate signe_max field
 */
export function validateSigneMax(signe_max: number, signe_min?: number): ValidationError | null {
  if (isNaN(signe_max) || signe_max < 1) {
    return { field: 'signe_max', message: 'Le signe maximum doit être un nombre positif' };
  }
  if (signe_max > 100) {
    return { field: 'signe_max', message: 'Le signe maximum ne doit pas dépasser 100' };
  }
  if (signe_min && signe_max < signe_min) {
    return { field: 'signe_max', message: 'Le signe maximum doit être supérieur au signe minimum' };
  }
  return null;
}

/**
 * Validate complete section payload
 */
export function validateGestionRubriques(payload: GestionRubriquesPayload): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate name
  const nameError = validateName(payload.name);
  if (nameError) errors.push(nameError);

  // Validate signe_min
  const signeMinError = validateSigneMin(payload.signe_min);
  if (signeMinError) errors.push(signeMinError);

  // Validate signe_max
  const signeMaxError = validateSigneMax(payload.signe_max, payload.signe_min);
  if (signeMaxError) errors.push(signeMaxError);

  return errors;
}

/**
 * Check if user can edit sections
 */
export function canEditGestionRubriques(
  userRoles: string[]
): boolean {
  // Only super admins can manage sections
  return userRoles.includes('SUPER_ADMIN');
}

/**
 * Check if user can delete sections
 */
export function canDeleteGestionRubriques(
  userRoles: string[]
): boolean {
  // Only super admins can manage sections
  return userRoles.includes('SUPER_ADMIN');
}

/**
 * Check if user can view sections
 */
export function canViewGestionRubriques(
  userRoles: string[]
): boolean {
  return userRoles.includes('SUPER_ADMIN');
}
