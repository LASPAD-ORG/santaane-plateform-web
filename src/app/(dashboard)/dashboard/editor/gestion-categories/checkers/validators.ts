export interface ValidationError {
  field: string;
  message: string;
}

export interface CategoryPayload {
  name: string;
  description?: string;
  parentId?: string;
}

export function validateName(name: string): ValidationError | null {
  if (!name || name.trim().length === 0) {
    return { field: 'name', message: 'Le nom est requis' };
  }
  if (name.length > 200) {
    return {
      field: 'name',
      message: 'Le nom ne peut pas dépasser 200 caractères',
    };
  }
  return null;
}

export function validateDescription(description?: string): ValidationError | null {
  if (description && description.length > 1000) {
    return {
      field: 'description',
      message: 'La description ne peut pas dépasser 1000 caractères',
    };
  }
  return null;
}

export function validateCategory(payload: CategoryPayload): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameError = validateName(payload.name);
  if (nameError) errors.push(nameError);

  const descError = validateDescription(payload.description);
  if (descError) errors.push(descError);

  return errors;
}

export function canEditCategory(userRole: string): boolean {
  return userRole === 'EDITOR' || userRole === 'SUPER_ADMIN';
}

export function canDeleteCategory(userRole: string): boolean {
  return userRole === 'SUPER_ADMIN';
}

export function canViewCategories(userRole: string): boolean {
  const allowedRoles = ['EDITOR', 'SUPER_ADMIN', 'AUTHOR'];
  return allowedRoles.includes(userRole);
}
