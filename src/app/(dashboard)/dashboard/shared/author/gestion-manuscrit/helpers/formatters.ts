/**
 * Format date for gestion-manuscrit display
 */
export function formatGestionManuscritDate(dateString: string): string {
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
 * Get status label in French
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    brouillon: 'Brouillon',
    en_attente: 'En attente',
    publie: 'Publié',
    archive: 'Archivé',
    // Legacy support
    draft: 'Brouillon',
    pending: 'En attente',
    published: 'Publié',
    archived: 'Archivé',
  };
  return labels[status] || status;
}

/**
 * Get MUI color for status
 */
export function getStatusColor(status: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' {
  const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    brouillon: 'info',
    en_attente: 'primary',
    publie: 'success',
    archive: 'default',
    // Legacy support
    draft: 'info',
    pending: 'primary',
    published: 'success',
    archived: 'default',
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
