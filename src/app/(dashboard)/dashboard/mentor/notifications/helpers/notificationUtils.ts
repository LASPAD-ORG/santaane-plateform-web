// Types pour les filtres de notifications
export interface NotificationFilters {
  search: string;
  type: string;
  status: string;
  priority: string;
  dateRange: string;
}

// Types pour les notifications (unifié pour supporter les deux formats)
export interface Notification {
  id: string;
  title?: string;
  titre?: string; // Pour compatibilité avec NotificationMentor
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' | string;
  status?: 'READ' | 'UNREAD' | string;
  lu?: boolean; // Pour compatibilité avec NotificationMentor
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  priorite?: 'LOW' | 'MEDIUM' | 'HIGH' | string; // Pour compatibilité avec NotificationMentor
  createdAt?: string;
  dateCreation?: string; // Pour compatibilité avec NotificationMentor
  authorId?: string;
  auteurId?: string; // Pour compatibilité avec NotificationMentor
  mentorId?: string;
  actionUrl?: string; // Pour compatibilité avec NotificationMentor
}

// Fonctions utilitaires pour les notifications
export const getNotificationTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'INFO': 'Information',
    'WARNING': 'Avertissement',
    'ERROR': 'Erreur',
    'SUCCESS': 'Succès'
  };
  return labels[type] || type;
};

export const getNotificationTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    'INFO': 'primary',
    'WARNING': 'warning', 
    'ERROR': 'error',
    'SUCCESS': 'success',
    'decision_editeur': 'success',
    'delai_depasse': 'warning',
    'manuscrit_soumis': 'info',
    'echange_nouveau': 'primary'
  };
  return colors[type] || 'default';
};

export const getNotificationStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'READ': '#757575',
    'UNREAD': '#1976d2'
  };
  return colors[status] || '#757575';
};

export const getNotificationPriorityColor = (priority: string): 'success' | 'warning' | 'error' | 'default' => {
  const colors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
    'LOW': 'success',
    'MEDIUM': 'warning',
    'HIGH': 'error'
  };
  return colors[priority] || 'default';
};

export const formatNotificationDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  } else {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

export const filterNotifications = (
  notifications: Notification[],
  filters: NotificationFilters
): Notification[] => {
  return notifications.filter(notification => {
    // Filtre de recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const title = notification.title || notification.titre || '';
      const matchesSearch = 
        title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filtre de type
    if (filters.type && notification.type !== filters.type) {
      return false;
    }

    // Filtre de statut (gérer les deux formats)
    if (filters.status) {
      const status = notification.status || (notification.lu ? 'UNREAD' : 'READ') || '';
      if (status !== filters.status) return false;
    }

    // Filtre de priorité (gérer les deux formats)
    if (filters.priority) {
      const priority = notification.priority || notification.priorite || '';
      if (priority !== filters.priority) return false;
    }

    // Filtre de plage de dates
    if (filters.dateRange) {
      const notificationDate = new Date(
        notification.createdAt || notification.dateCreation || ''
      );
      const now = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (notificationDate < today) return false;
          break;
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          if (notificationDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          if (notificationDate < monthAgo) return false;
          break;
      }
    }

    return true;
  });
};

// Types pour le tri
export type NotificationSortField = 'date' | 'priority' | 'type';
export type NotificationSortDirection = 'asc' | 'desc';

export const sortNotifications = (
  notifications: Notification[],
  field: NotificationSortField,
  direction: NotificationSortDirection
): Notification[] => {
  return [...notifications].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'date':
        const dateA = new Date(a.createdAt || a.dateCreation || '').getTime();
        const dateB = new Date(b.createdAt || b.dateCreation || '').getTime();
        comparison = dateA - dateB;
        break;
      case 'priority':
        const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        const priorityA = priorityOrder[(a.priority || a.priorite || 'LOW') as keyof typeof priorityOrder];
        const priorityB = priorityOrder[(b.priority || b.priorite || 'LOW') as keyof typeof priorityOrder];
        comparison = priorityA - priorityB;
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
    }

    return direction === 'desc' ? -comparison : comparison;
  });
};
