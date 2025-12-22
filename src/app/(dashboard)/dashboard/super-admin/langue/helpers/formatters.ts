/**
 * Format date for language display
 */
export function formatLangueDate(dateString: string): string {
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
 * Format language code for display
 */
export function formatLanguageCode(code: string): string {
  return code.toUpperCase();
}

/**
 * Get language display name
 */
export function getLanguageDisplayName(name: string, code: string): string {
  return `${name} (${code.toUpperCase()})`;
}

/**
 * Truncate content with ellipsis
 */
export function truncateContent(content: string, maxLength: number = 150): string {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
}
