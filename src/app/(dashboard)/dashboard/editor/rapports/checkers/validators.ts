// Validators for statistics - read-only page
export interface ValidationError {
  field: string;
  message: string;
}

export function canViewStatistics(userRole: string): boolean {
  return userRole === 'EDITOR' || userRole === 'SUPER_ADMIN';
}
