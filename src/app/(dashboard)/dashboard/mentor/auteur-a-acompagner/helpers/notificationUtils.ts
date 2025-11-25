import { NotificationMentor } from '../fetchers/useFetchAuteurAAcompagner';

/**
 * Tronquer un texte à une longueur maximale
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Obtenir le libellé du type de notification
 */
export function getNotificationTypeLabel(type: NotificationMentor['type']): string {
    const labels: Record<NotificationMentor['type'], string> = {
        echange_nouveau: 'Nouvel échange',
        decision_editeur: 'Décision éditeur',
        delai_depasse: 'Délai dépassé',
        manuscrit_soumis: 'Manuscrit soumis',
    };
    return labels[type] || type;
}

/**
 * Obtenir la couleur selon le type de notification
 */
export function getNotificationTypeColor(type: NotificationMentor['type']): 'primary' | 'success' | 'warning' | 'error' | 'info' {
    const colors: Record<NotificationMentor['type'], 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
        echange_nouveau: 'primary',
        decision_editeur: 'success',
        delai_depasse: 'warning',
        manuscrit_soumis: 'info',
    };
    return colors[type] || 'info';
}

/**
 * Obtenir la sévérité pour les alertes
 */
export function getNotificationSeverity(notification: NotificationMentor): 'error' | 'warning' | 'info' | 'success' {
    // Priorité haute = erreur
    if (notification.priorite === 'high') return 'error';

    // Types spécifiques
    if (notification.type === 'decision_editeur') return 'success';
    if (notification.type === 'delai_depasse') return 'warning';

    // Par défaut, selon la priorité
    if (notification.priorite === 'medium') return 'warning';
    return 'info';
}

/**
 * Grouper les notifications par catégorie
 */
export function groupNotificationsByType(notifications: NotificationMentor[]) {
    return notifications.reduce((acc, notification) => {
        const type = notification.type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(notification);
        return acc;
    }, {} as Record<string, NotificationMentor[]>);
}

/**
 * Grouper les notifications par auteur
 */
export function groupNotificationsByAuthor(notifications: NotificationMentor[]) {
    return notifications.reduce((acc, notification) => {
        const authorId = notification.auteurId;
        if (!acc[authorId]) {
            acc[authorId] = [];
        }
        acc[authorId].push(notification);
        return acc;
    }, {} as Record<string, NotificationMentor[]>);
}

/**
 * Filtrer les notifications selon les critères
 */
export interface NotificationFilters {
    searchTerm?: string;
    type?: NotificationMentor['type'] | '';
    priorite?: NotificationMentor['priorite'] | '';
    lu?: boolean | null;
    auteurId?: string;
    manuscritId?: string;
    dateDebut?: Date;
    dateFin?: Date;
}

export function filterNotifications(
    notifications: NotificationMentor[],
    filters: NotificationFilters
): NotificationMentor[] {
    return notifications.filter(notification => {
        // Recherche textuelle
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            const matchesSearch =
                notification.titre.toLowerCase().includes(searchLower) ||
                notification.message.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
        }

        // Type
        if (filters.type && notification.type !== filters.type) {
            return false;
        }

        // Priorité
        if (filters.priorite && notification.priorite !== filters.priorite) {
            return false;
        }

        // Statut lu/non lu
        if (filters.lu !== null && filters.lu !== undefined) {
            if (notification.lu !== filters.lu) return false;
        }

        // Auteur
        if (filters.auteurId && notification.auteurId !== filters.auteurId) {
            return false;
        }

        // Manuscrit
        if (filters.manuscritId && notification.manuscritId !== filters.manuscritId) {
            return false;
        }

        // Plage de dates
        if (filters.dateDebut || filters.dateFin) {
            const notifDate = new Date(notification.dateCreation);

            if (filters.dateDebut && notifDate < filters.dateDebut) {
                return false;
            }

            if (filters.dateFin && notifDate > filters.dateFin) {
                return false;
            }
        }

        return true;
    });
}

/**
 * Trier les notifications
 */
export type NotificationSortField = 'date' | 'priorite' | 'type';
export type NotificationSortDirection = 'asc' | 'desc';

export function sortNotifications(
    notifications: NotificationMentor[],
    field: NotificationSortField,
    direction: NotificationSortDirection = 'desc'
): NotificationMentor[] {
    const sorted = [...notifications].sort((a, b) => {
        let comparison = 0;

        switch (field) {
            case 'date':
                comparison = new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime();
                break;

            case 'priorite':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                comparison = priorityOrder[a.priorite] - priorityOrder[b.priorite];
                break;

            case 'type':
                comparison = a.type.localeCompare(b.type);
                break;
        }

        return direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
}

/**
 * Calculer les statistiques de notifications
 */
export interface NotificationStats {
    total: number;
    nonLues: number;
    parType: Record<string, number>;
    parPriorite: Record<string, number>;
    urgentes: number;
    aujourdhui: number;
    derniereSemaine: number;
}

export function getNotificationStats(notifications: NotificationMentor[]): NotificationStats {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats: NotificationStats = {
        total: notifications.length,
        nonLues: 0,
        parType: {},
        parPriorite: {},
        urgentes: 0,
        aujourdhui: 0,
        derniereSemaine: 0,
    };

    notifications.forEach(notification => {
        // Non lues
        if (!notification.lu) stats.nonLues++;

        // Par type
        stats.parType[notification.type] = (stats.parType[notification.type] || 0) + 1;

        // Par priorité
        stats.parPriorite[notification.priorite] = (stats.parPriorite[notification.priorite] || 0) + 1;

        // Urgentes
        if (notification.priorite === 'high') stats.urgentes++;

        // Aujourd'hui
        const notifDate = new Date(notification.dateCreation);
        if (notifDate >= today) stats.aujourdhui++;

        // Dernière semaine
        if (notifDate >= lastWeek) stats.derniereSemaine++;
    });

    return stats;
}

/**
 * Générer un message récapitulatif pour email
 */
export function generateNotificationSummary(notifications: NotificationMentor[]): string {
    const stats = getNotificationStats(notifications);
    const lines: string[] = [];

    lines.push(`Vous avez ${stats.total} notification(s) dont ${stats.nonLues} non lue(s).`);

    if (stats.urgentes > 0) {
        lines.push(`\n⚠️ ${stats.urgentes} notification(s) urgente(s) nécessitent votre attention.`);
    }

    if (stats.aujourdhui > 0) {
        lines.push(`\n📅 ${stats.aujourdhui} notification(s) reçue(s) aujourd'hui.`);
    }

    return lines.join('\n');
}

/**
 * Jouer un son de notification
 */
export function playNotificationSound(priority: 'low' | 'medium' | 'high'): void {
    if (typeof window === 'undefined' || !('AudioContext' in window)) return;

    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Fréquence selon la priorité
        oscillator.frequency.value = priority === 'high' ? 800 : priority === 'medium' ? 600 : 400;

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        console.warn('Could not play notification sound:', e);
    }
}
