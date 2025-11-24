export interface ValidationError {
  field: string;
  message: string;
}

// Payload interface for creating/updating auteur-a-acompagner
export interface AuteurAAcompagnerPayload {
  nom: string;
  prenom: string;
  email: string;
  specialites?: string[];
  // Add more fields as needed
}

/**
 * Validate nom field
 */
export function validateNom(nom: string): ValidationError | null {
  if (!nom || nom.trim().length === 0) {
    return { field: 'nom', message: 'Le nom est requis' };
  }
  if (nom.length < 2) {
    return { field: 'nom', message: 'Le nom doit contenir au moins 2 caractères' };
  }
  if (nom.length > 50) {
    return { field: 'nom', message: 'Le nom ne doit pas dépasser 50 caractères' };
  }
  return null;
}

/**
 * Validate prenom field
 */
export function validatePrenom(prenom: string): ValidationError | null {
  if (!prenom || prenom.trim().length === 0) {
    return { field: 'prenom', message: 'Le prénom est requis' };
  }
  if (prenom.length < 2) {
    return { field: 'prenom', message: 'Le prénom doit contenir au moins 2 caractères' };
  }
  if (prenom.length > 50) {
    return { field: 'prenom', message: 'Le prénom ne doit pas dépasser 50 caractères' };
  }
  return null;
}

/**
 * Validate email field
 */
export function validateEmail(email: string): ValidationError | null {
  if (!email || email.trim().length === 0) {
    return { field: 'email', message: 'L\'email est requis' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'L\'email n\'est pas valide' };
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
 * Validate complete auteur-a-acompagner payload
 */
export function validateAuteurAAcompagner(payload: AuteurAAcompagnerPayload): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate nom
  const nomError = validateNom(payload.nom);
  if (nomError) errors.push(nomError);

  // Validate prenom
  const prenomError = validatePrenom(payload.prenom);
  if (prenomError) errors.push(prenomError);

  // Validate email
  const emailError = validateEmail(payload.email);
  if (emailError) errors.push(emailError);

  // Add more validations as needed

  return errors;
}

/**
 * Check if user can edit this auteur-a-acompagner
 */
export function canEditAuteurAAcompagner(
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
 * Check if user can delete this auteur-a-acompagner
 */
export function canDeleteAuteurAAcompagner(
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
 * Check if user can view this auteur-a-acompagner
 */
export function canViewAuteurAAcompagner(
  itemOwnerId: string,
  currentUserId: string,
  userRoles: string[]
): boolean {
  // All authenticated users can view (adjust based on your requirements)
  return true;
}
