export interface ValidationError {
  field: string;
  message: string;
}

// Payload interface for creating/updating languages
export interface LanguePayload {
  name: string;
  code: string;
}

/**
 * Validate name field
 */
export function validateName(name: string): ValidationError | null {
  if (!name || name.trim().length === 0) {
    return { field: 'name', message: 'Le nom est requis' };
  }
  if (name.length < 2) {
    return { field: 'name', message: 'Le nom doit contenir au moins 2 caractères' };
  }
  if (name.length > 100) {
    return { field: 'name', message: 'Le nom ne doit pas dépasser 100 caractères' };
  }
  return null;
}

/**
 * Validate code field
 */
export function validateCode(code: string): ValidationError | null {
  if (!code || code.trim().length === 0) {
    return { field: 'code', message: 'Le code est requis' };
  }
  if (code.length < 2) {
    return { field: 'code', message: 'Le code doit contenir au moins 2 caractères' };
  }
  if (code.length > 10) {
    return { field: 'code', message: 'Le code ne doit pas dépasser 10 caractères' };
  }
  // Check if code contains only letters and optionally hyphen/underscore
  if (!/^[a-zA-Z-_]+$/.test(code)) {
    return { field: 'code', message: 'Le code ne doit contenir que des lettres, tirets ou underscores' };
  }
  return null;
}

/**
 * Validate complete language payload
 */
export function validateLangue(payload: LanguePayload): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate name
  const nameError = validateName(payload.name);
  if (nameError) errors.push(nameError);

  // Validate code
  const codeError = validateCode(payload.code);
  if (codeError) errors.push(codeError);

  return errors;
}

/**
 * Check if user can edit languages
 */
export function canEditLangue(
  userRoles: string[]
): boolean {
  // Only super admins can manage languages
  return userRoles.includes('SUPER_ADMIN');
}

/**
 * Check if user can delete languages
 */
export function canDeleteLangue(
  userRoles: string[]
): boolean {
  // Only super admins can manage languages
  return userRoles.includes('SUPER_ADMIN');
}

/**
 * Check if user can view languages
 */
export function canViewLangue(
  userRoles: string[]
): boolean {
  return userRoles.includes('SUPER_ADMIN');
}
