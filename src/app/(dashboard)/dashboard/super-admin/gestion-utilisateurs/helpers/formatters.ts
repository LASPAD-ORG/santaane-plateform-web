import { UserRole } from '@/types/auth';
import { User, BackendUser, UserStatus, UpdateUserData, CreateUserData } from '../fetchers/useFetchGestionUtilisateurs';

/**
 * Format date for gestion-utilisateurs display
 */
export function formatGestionUtilisateursDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const formatUserDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatUserDateTime = (dateString?: string): string => {
  if (!dateString) return 'Jamais';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get status label in French
 */
export function getStatusLabel(isActive: boolean): string {
  return isActive ? 'Actif' : 'Inactif';
}

/**
 * Get MUI color for status
 */
export function getStatusColor(isActive: boolean): string {
  return isActive ? '#4caf50' : '#9e9e9e';
}

/**
 * Truncate content with ellipsis
 */
export function truncateContent(content: string, maxLength: number = 150): string {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
}

/**
 * Format author name
 */
export function formatAuthorName(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return 'Anonyme';
  return [firstName, lastName].filter(Boolean).join(' ');
}

/**
 * Get initials from name
 */
export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || 'AN';
}

export const getUserInitials = (prenom: string, nom: string): string => {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
};

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Calculate reading time (assuming 200 words per minute)
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes === 1 ? '1 min' : `${minutes} mins`;
}

/**
 * Maps backend user structure to frontend user structure
 */
export function mapBackendUserToFrontend(backendUser: BackendUser): User {
  const nameParts = (backendUser.fullName || backendUser.full_name || '').trim().split(/\s+/);
  const prenom = nameParts[0] || '';
  const nom = nameParts.slice(1).join(' ') || '';

  const roles = (backendUser.roles || []).map((r: any) => {
    if (typeof r === 'string') return r;
    if (typeof r === 'object' && r.name) return r.name;
    return String(r);
  });

  const roleIds = (backendUser.roles || []).map((r: any) => {
    if (typeof r === 'object' && r.id !== undefined) return r.id;
    return 0;
  });

  return {
    id: backendUser.id.toString(),
    email: backendUser.email,
    prenom,
    nom,
    fullName: backendUser.fullName || backendUser.full_name,
    roles,
    roleIds,
    isActive: backendUser.isActive,
    laboratoire: backendUser.country_id?.toString(), // Mocked mapping for now
    specialite: backendUser.city_id?.toString(), // Mocked mapping for now
    telephone: backendUser.orcid_id || '', // Mocked mapping for now
    dateCreation: backendUser.created_at,
    derniereConnexion: backendUser.updated_at,
    emailVerifie: backendUser.emailVerified,
    avatar: backendUser.profile_photo || undefined,
  };
}

/**
 * Maps an array of backend users to frontend users
 */
export function mapBackendUsersToFrontend(backendUsers: BackendUser[]): User[] {
  return backendUsers.map(mapBackendUserToFrontend);
}

/**
 * Maps frontend update data to backend payload
 */
export function mapFrontendUserToBackendUpdate(data: UpdateUserData): Record<string, any> {
  const payload: Record<string, any> = {};

  if (data.prenom || data.nom) {
    const parts = [];
    if (data.prenom) parts.push(data.prenom);
    if (data.nom) parts.push(data.nom);
    if (parts.length > 0) {
      payload.fullName = parts.join(' ');
    }
  }

  // Roles are handled separately via /api/roles/assign and /api/roles/remove

  if (data.isActive !== undefined) {
    payload.isActive = data.isActive;
  }

  return payload;
}

/**
 * Maps frontend creation data to backend payload
 * Returns both the payload and the generated password
 */
export function mapFrontendUserToBackendCreate(data: CreateUserData): { payload: Record<string, any>; temporaryPassword: string } {
  const temporaryPassword = generateRandomPassword(12);
  
  const payload = {
    email: data.email,
    fullName: `${data.prenom} ${data.nom}`.trim(),
    // Roles are handled separately after creation
    password: temporaryPassword,
    // Optional fields that match BackendUser/RegisterPayload
    orcid_id: data.telephone || undefined,
  };

  return { payload, temporaryPassword };
}


export const sortUsersByField = (users: User[], field: keyof User, direction: 'asc' | 'desc' = 'asc'): User[] => {
  return [...users].sort((a, b) => {
    const aValue = a[field] as any;
    const bValue = b[field] as any;

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterUsersByText = (users: User[], searchText: string): User[] => {
  const search = searchText.toLowerCase().trim();
  if (!search) return users;

  return users.filter(user =>
    user.prenom.toLowerCase().includes(search) ||
    user.nom.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search) ||
    (user.telephone && user.telephone.includes(search)) ||
    (user.laboratoire && user.laboratoire.toLowerCase().includes(search)) ||
    (user.specialite && user.specialite.toLowerCase().includes(search))
  );
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)\.]{10,}$/;
  return phoneRegex.test(phone);
};

export const generateRandomPassword = (length: number = 12): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

export const exportUsersToCSV = (users: User[]): void => {
  const headers = [
    'ID',
    'Prénom',
    'Nom',
    'Email',
    'Téléphone',
    'Rôles',
    'Statut',
    'Laboratoire',
    'Spécialité',
    'Date création',
    'Dernière connexion',
    'Email vérifié'
  ];

  const csvContent = [
    headers.join(','),
    ...users.map(user => [
      user.id,
      user.prenom,
      user.nom,
      user.email,
      user.telephone || '',
      user.roles.join(';'),
      user.isActive ? 'Actif' : 'Inactif',
      user.laboratoire || '',
      user.specialite || '',
      formatUserDate(user.dateCreation),
      user.derniereConnexion ? formatUserDateTime(user.derniereConnexion) : 'Jamais',
      user.emailVerifie ? 'Oui' : 'Non'
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  const today = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `utilisateurs_${today}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
