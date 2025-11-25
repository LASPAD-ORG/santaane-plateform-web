'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { NotificationMentor } from '../fetchers/useFetchAuteurAAcompagner';

// Préférences de notification
export interface NotificationPreferences {
    enablePopups: boolean;
    enableSounds: boolean;
    enableEmailNotifications: boolean;
    emailFrequency: 'immediate' | 'daily' | 'weekly';
    notificationTypes: {
        echange_nouveau: boolean;
        decision_editeur: boolean;
        delai_depasse: boolean;
        manuscrit_soumis: boolean;
    };
}

// État du contexte
interface NotificationContextState {
    notifications: NotificationMentor[];
    unreadCount: number;
    loading: boolean;
    preferences: NotificationPreferences;
    // Actions
    markAsRead: (notificationId: string) => void;
    markAllAsRead: () => void;
    archiveNotification: (notificationId: string) => void;
    deleteNotification: (notificationId: string) => void;
    updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
    refreshNotifications: () => Promise<void>;
    // Pour les nouvelles notifications (déclenchent pop-up)
    newNotifications: NotificationMentor[];
    clearNewNotifications: () => void;
}

const defaultPreferences: NotificationPreferences = {
    enablePopups: true,
    enableSounds: true,
    enableEmailNotifications: false,
    emailFrequency: 'immediate',
    notificationTypes: {
        echange_nouveau: true,
        decision_editeur: true,
        delai_depasse: true,
        manuscrit_soumis: true,
    },
};

const NotificationContext = createContext<NotificationContextState | undefined>(undefined);

// Hook pour utiliser le contexte
export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}

interface NotificationProviderProps {
    children: ReactNode;
    initialNotifications?: NotificationMentor[];
}

export function NotificationProvider({ children, initialNotifications = [] }: NotificationProviderProps) {
    const [notifications, setNotifications] = useState<NotificationMentor[]>(initialNotifications);
    const [newNotifications, setNewNotifications] = useState<NotificationMentor[]>([]);
    const [loading, setLoading] = useState(false);
    const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
        // Charger les préférences depuis localStorage
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('mentor_notification_preferences');
            if (saved) {
                try {
                    return { ...defaultPreferences, ...JSON.parse(saved) };
                } catch (e) {
                    console.error('Error loading notification preferences:', e);
                }
            }
        }
        return defaultPreferences;
    });

    // Calculer le nombre de notifications non lues
    const unreadCount = notifications.filter(n => !n.lu).length;

    // Fonction pour charger les notifications (simulée - à remplacer par un vrai appel API)
    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            // TODO: Remplacer par un vrai appel API
            // const response = await apiClient.get('/api/v1/mentor/notifications');
            // return response.data;

            // Pour l'instant, on retourne les notifications existantes
            return notifications;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [notifications]);

    // Polling pour les nouvelles notifications
    useEffect(() => {
        const POLLING_INTERVAL = 30000; // 30 secondes

        const pollNotifications = async () => {
            // Ne pas polling si l'onglet n'est pas actif
            if (document.hidden) return;

            const latestNotifications = await fetchNotifications();

            // Détecter les nouvelles notifications
            const existingIds = new Set(notifications.map(n => n.id));
            const newOnes = latestNotifications.filter(n => !existingIds.has(n.id));

            if (newOnes.length > 0) {
                // Filtrer selon les préférences
                const filteredNew = newOnes.filter(n =>
                    preferences.notificationTypes[n.type]
                );

                if (filteredNew.length > 0 && preferences.enablePopups) {
                    setNewNotifications(prev => [...prev, ...filteredNew]);
                }

                setNotifications(latestNotifications);
            }
        };

        const intervalId = setInterval(pollNotifications, POLLING_INTERVAL);

        // Cleanup
        return () => clearInterval(intervalId);
    }, [fetchNotifications, notifications, preferences]);

    // Marquer une notification comme lue
    const markAsRead = useCallback((notificationId: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === notificationId ? { ...n, lu: true } : n))
        );

        // TODO: Appel API pour persister
        // await apiClient.patch(`/api/v1/mentor/notifications/${notificationId}/read`);
    }, []);

    // Marquer toutes les notifications comme lues
    const markAllAsRead = useCallback(() => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, lu: true }))
        );

        // TODO: Appel API pour persister
        // await apiClient.patch('/api/v1/mentor/notifications/read-all');
    }, []);

    // Archiver une notification
    const archiveNotification = useCallback((notificationId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));

        // TODO: Appel API pour persister
        // await apiClient.post(`/api/v1/mentor/notifications/${notificationId}/archive`);
    }, []);

    // Supprimer une notification
    const deleteNotification = useCallback((notificationId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));

        // TODO: Appel API pour persister
        // await apiClient.delete(`/api/v1/mentor/notifications/${notificationId}`);
    }, []);

    // Mettre à jour les préférences
    const updatePreferences = useCallback((newPreferences: Partial<NotificationPreferences>) => {
        setPreferences(prev => {
            const updated = { ...prev, ...newPreferences };

            // Sauvegarder dans localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('mentor_notification_preferences', JSON.stringify(updated));
            }

            // TODO: Appel API pour persister côté serveur
            // await apiClient.patch('/api/v1/mentor/notification-preferences', updated);

            return updated;
        });
    }, []);

    // Rafraîchir manuellement les notifications
    const refreshNotifications = useCallback(async () => {
        const latest = await fetchNotifications();
        setNotifications(latest);
    }, [fetchNotifications]);

    // Effacer les nouvelles notifications (après affichage dans le snackbar)
    const clearNewNotifications = useCallback(() => {
        setNewNotifications([]);
    }, []);

    const value: NotificationContextState = {
        notifications,
        unreadCount,
        loading,
        preferences,
        markAsRead,
        markAllAsRead,
        archiveNotification,
        deleteNotification,
        updatePreferences,
        refreshNotifications,
        newNotifications,
        clearNewNotifications,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}
