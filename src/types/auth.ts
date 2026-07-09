// User roles
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DEVELOPER = 'DEVELOPER',
  EDITOR = 'EDITOR',
  EVALUATOR = 'EVALUATOR',
  INTERNAL_EVALUATOR = 'INTERNAL_EVALUATOR',   // ← nouveau
  AUTHOR = 'AUTHOR',
}

// User interface
export interface User {
  id: string;
  email: string;
  fullName: string;
  roles: UserRole[]; // Changed from 'role' to 'roles' (array)
  countryId?: number | null;
  cityId?: number | null;
  timezone?: string | null;
  profilePhoto?: string | null;
  orcidId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Registration payload
export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  countryId?: number | null;
  cityId?: number | null;
  timezone?: string | null;
  profilePhoto?: string | null;
  orcidId?: string | null;
}

// Login payload (OAuth2 format)
export interface LoginPayload {
  username: string; // email
  password: string;
  grant_type?: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
}

// Auth response from API
export interface AuthResponse {
  access_token: string;
  tokenType: string;
  user?: User;
}

// Auth state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
}
