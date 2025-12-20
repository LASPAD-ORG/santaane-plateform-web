export interface ValidationError {
  field: string;
  message: string;
}

export function validateLaboratoryName(name: string): ValidationError | null {
  if (!name || name.trim().length === 0) {
    return { field: 'name', message: 'Le nom est requis' };
  }
  return null;
}

export function canEditLaboratory(userRole: string): boolean {
  return userRole === 'EDITOR' || userRole === 'SUPER_ADMIN';
}
