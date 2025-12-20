export function formatManuscritDate(dateString?: string): string {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatShortDate(dateString?: string): string {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function getStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    DRAFT: 'Brouillon',
    SUBMITTED: 'Soumis',
    UNDER_REVIEW: 'En révision',
    REVISION_REQUESTED: 'Révision demandée',
    REVISED: 'Révisé',
    ACCEPTED: 'Accepté',
    REJECTED: 'Rejeté',
    PUBLISHED: 'Publié',
    WITHDRAWN: 'Retiré',
  };

  return statusLabels[status] || status;
}

export function getStatusColor(
  status: string
): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  const statusColors: Record<string, any> = {
    DRAFT: 'default',
    SUBMITTED: 'info',
    UNDER_REVIEW: 'primary',
    REVISION_REQUESTED: 'warning',
    REVISED: 'secondary',
    ACCEPTED: 'success',
    REJECTED: 'error',
    PUBLISHED: 'success',
    WITHDRAWN: 'default',
  };

  return statusColors[status] || 'default';
}

export function getReviewStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    PENDING: 'En attente',
    ACCEPTED: 'Acceptée',
    DECLINED: 'Déclinée',
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Complétée',
    OVERDUE: 'En retard',
  };

  return statusLabels[status] || status;
}

export function getRecommendationLabel(recommendation: string): string {
  const labels: Record<string, string> = {
    ACCEPT: 'Accepter',
    MINOR_REVISION: 'Révision mineure',
    MAJOR_REVISION: 'Révision majeure',
    REJECT: 'Rejeter',
  };

  return labels[recommendation] || recommendation;
}

export function getDecisionLabel(decision: string): string {
  return getRecommendationLabel(decision);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function formatAuthorName(fullName: string): string {
  return fullName || 'Auteur inconnu';
}

export function getAuthorInitials(fullName: string): string {
  if (!fullName) return '?';

  const parts = fullName.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
}

export function calculateDaysUntilDue(dueDate?: string): number | null {
  if (!dueDate) return null;

  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export function formatDaysUntilDue(dueDate?: string): string {
  const days = calculateDaysUntilDue(dueDate);

  if (days === null) return 'Pas de date limite';
  if (days < 0) return `En retard de ${Math.abs(days)} jour(s)`;
  if (days === 0) return "Échéance aujourd'hui";
  if (days === 1) return 'Échéance demain';
  return `${days} jour(s) restant(s)`;
}

export function getReviewProgress(
  completedCount: number,
  totalCount: number
): string {
  if (totalCount === 0) return 'Aucune évaluation';
  const percentage = Math.round((completedCount / totalCount) * 100);
  return `${completedCount}/${totalCount} (${percentage}%)`;
}

export function getMentorshipStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: 'Actif',
    COMPLETED: 'Terminé',
    CANCELLED: 'Annulé',
    ON_HOLD: 'En pause',
  };

  return labels[status] || status;
}

export function formatKeywords(keywords?: string): string[] {
  if (!keywords) return [];
  return keywords.split(',').map((k) => k.trim());
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
