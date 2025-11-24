import { UserRole } from '@/types/auth';

export interface User {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  roles: UserRole[];
  status: UserStatus;
  laboratoire?: string;
  specialite?: string;
  telephone?: string;
  dateCreation: string;
  derniereConnexion?: string;
  emailVerifie: boolean;
  avatar?: string;
  isActive: boolean;
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
}

export interface UserFilters {
  search: string;
  roles: UserRole[];
  status: UserStatus | '';
  laboratoire: string;
  specialite: string;
  dateCreationDebut: string;
  dateCreationFin: string;
  derniereConnexion: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  suspended: number;
  byRole: Record<UserRole, number>;
  byLaboratoire: Record<string, number>;
  newThisMonth: number;
  activeThisWeek: number;
}

export interface Pagination {
  page: number;
  size: number;
  total: number;
}

export interface CreateUserData {
  email: string;
  prenom: string;
  nom: string;
  roles: UserRole[];
  laboratoire?: string;
  specialite?: string;
  telephone?: string;
  sendWelcomeEmail: boolean;
}

export interface UpdateUserData {
  prenom?: string;
  nom?: string;
  roles?: UserRole[];
  laboratoire?: string;
  specialite?: string;
  telephone?: string;
  status?: UserStatus;
}