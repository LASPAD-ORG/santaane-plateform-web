// Utilitaires pour la gestion des dates des thèmes

export const calculateDaysRemaining = (dateLimite: string | null): number | null => {
  if (!dateLimite) return null;
  
  const today = new Date();
  const deadlineDate = new Date(dateLimite);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const isThemeExpired = (dateLimite: string | null): boolean => {
  if (!dateLimite) return false;
  const daysRemaining = calculateDaysRemaining(dateLimite);
  return daysRemaining !== null && daysRemaining <= 0;
};

export const getThemeStatusText = (dateLimite: string | null): { text: string; color: string } => {
  if (!dateLimite) {
    return { text: 'Pas de limite', color: 'text.secondary' };
  }
  
  const daysRemaining = calculateDaysRemaining(dateLimite);
  
  if (daysRemaining === null) {
    return { text: 'Pas de limite', color: 'text.secondary' };
  }
  
  if (daysRemaining < 0) {
    return { text: `Expiré depuis ${Math.abs(daysRemaining)} jour${Math.abs(daysRemaining) > 1 ? 's' : ''}`, color: 'error.main' };
  }
  
  if (daysRemaining === 0) {
    return { text: 'Expire aujourd\'hui', color: 'warning.main' };
  }
  
  if (daysRemaining <= 7) {
    return { text: `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}`, color: 'warning.main' };
  }
  
  return { text: `${daysRemaining} jours restants`, color: 'success.main' };
};

export const formatDateForDisplay = (date: string | null): string => {
  if (!date) return 'Pas de limite';
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Date invalide';
  }
};