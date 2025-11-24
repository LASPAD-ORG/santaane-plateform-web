import { User, UserStatus } from '../types';
// Utility functions for date formatting without external dependencies

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

export const getStatusColor = (status: UserStatus): string => {
  switch (status) {
    case UserStatus.ACTIVE:
      return '#4caf50';
    case UserStatus.INACTIVE:
      return '#9e9e9e';
    case UserStatus.PENDING:
      return '#ff9800';
    case UserStatus.SUSPENDED:
      return '#f44336';
    default:
      return '#9e9e9e';
  }
};

export const getStatusLabel = (status: UserStatus): string => {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'Actif';
    case UserStatus.INACTIVE:
      return 'Inactif';
    case UserStatus.PENDING:
      return 'En attente';
    case UserStatus.SUSPENDED:
      return 'Suspendu';
    default:
      return status;
  }
};

export const getUserInitials = (prenom: string, nom: string): string => {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
};

export const sortUsersByField = (users: User[], field: keyof User, direction: 'asc' | 'desc' = 'asc'): User[] => {
  return [...users].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    
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
      user.status,
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