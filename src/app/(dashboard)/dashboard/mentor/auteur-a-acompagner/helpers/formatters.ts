/**
 * Get full name of author
 */
export function getAuteurFullName(prenom: string, nom: string): string {
  return `${prenom} ${nom}`;
}

/**
 * Get author initials for avatar
 */
export function getAuteurInitials(prenom: string, nom: string): string {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}

/**
 * Format contact time relative
 */
export function formatDernierContact(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return 'Il y a quelques minutes';
  } else if (diffInHours < 24) {
    return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    } else if (diffInDays < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `Il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`;
    } else {
      const diffInMonths = Math.floor(diffInDays / 30);
      return `Il y a ${diffInMonths} mois`;
    }
  }
}

/**
 * Get priority color for exchanges
 */
export function getPrioriteColor(priorite: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' {
  const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    low: 'info',
    medium: 'primary',
    high: 'error',
  };
  return colors[priorite] || 'default';
}

/**
 * Get exchange type color
 */
export function getEchangeTypeColor(type: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' {
  const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    commentaire: 'info',
    decision: 'success',
    demande_revision: 'primary',
    validation: 'secondary',
  };
  return colors[type] || 'default';
}

/**
 * Get exchange type label
 */
export function getEchangeTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    commentaire: 'Commentaire',
    decision: 'Décision',
    demande_revision: 'Révision demandée',
    validation: 'Validation',
  };
  return labels[type] || type;
}

/**
 * Get notification type color
 */
export function getNotificationTypeColor(type: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' {
  const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    echange_nouveau: 'primary',
    decision_editeur: 'success',
    delai_depasse: 'error',
    manuscrit_soumis: 'info',
  };
  return colors[type] || 'default';
}

/**
 * Get validation status label
 */
export function getValidationStatusLabel(statut: string): string {
  const labels: Record<string, string> = {
    en_attente: 'En attente',
    en_cours: 'En cours',
    valide: 'Validé',
    besoin_revision: 'Besoin révision',
  };
  return labels[statut] || statut;
}

/**
 * Get validation status color
 */
export function getValidationStatusColor(statut: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' {
  const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    en_attente: 'default',
    en_cours: 'primary',
    valide: 'success',
    besoin_revision: 'warning',
  };
  return colors[statut] || 'default';
}

/**
 * Format date for auteur-a-acompagner display
 */
export function formatAuteurAAcompagnerDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get status label in French for auteurs
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    actif: 'Actif',
    inactif: 'Inactif',
    suspendu: 'Suspendu',
    // Legacy support
    draft: 'Brouillon',
    pending: 'En attente',
    published: 'Publié',
    archived: 'Archivé',
  };
  return labels[status] || status;
}

/**
 * Get MUI color for auteur status
 */
export function getStatusColor(status: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' {
  const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    actif: 'success',
    inactif: 'default',
    suspendu: 'error',
    // Legacy support
    draft: 'default',
    pending: 'warning',
    published: 'success',
    archived: 'error',
  };
  return colors[status] || 'default';
}

/**
 * Get status label in French for manuscrits
 */
export function getManuscritStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    brouillon: 'Brouillon',
    en_attente: 'En attente',
    publie: 'Publié',
    archive: 'Archivé',
  };
  return labels[status] || status;
}

/**
 * Get MUI color for manuscrit status
 */
export function getManuscritStatusColor(status: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' {
  const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    brouillon: 'info',
    en_attente: 'primary',
    publie: 'success',
    archive: 'default',
  };
  return colors[status] || 'default';
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
