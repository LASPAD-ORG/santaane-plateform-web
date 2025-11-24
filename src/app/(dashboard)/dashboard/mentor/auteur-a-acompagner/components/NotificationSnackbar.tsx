'use client';

import { useEffect, useState } from 'react';
import {
    Snackbar,
    Alert,
    AlertTitle,
    IconButton,
    Box,
    Slide,
    Stack,
} from '@mui/material';
import {
    Close as CloseIcon,
    Launch as LaunchIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { NotificationMentor } from '../fetchers/useFetchAuteurAAcompagner';
import { useNotifications } from '../contexts/NotificationContext';
import { getNotificationSeverity, playNotificationSound } from '../helpers/notificationUtils';

interface NotificationSnackbarProps {
    maxVisible?: number;
}

interface SnackbarNotification {
    id: string;
    notification: NotificationMentor;
    open: boolean;
}

const DISPLAY_DURATION = 6000; // 6 secondes

export default function NotificationSnackbar({ maxVisible = 3 }: NotificationSnackbarProps) {
    const router = useRouter();
    const { newNotifications, clearNewNotifications, markAsRead, preferences } = useNotifications();
    const [displayedNotifications, setDisplayedNotifications] = useState<SnackbarNotification[]>([]);

    // Gérer les nouvelles notifications
    useEffect(() => {
        if (newNotifications.length > 0 && preferences.enablePopups) {
            // Convertir en format pour affichage
            const toDisplay = newNotifications.slice(0, maxVisible).map(n => ({
                id: n.id,
                notification: n,
                open: true,
            }));

            setDisplayedNotifications(prev => {
                // Fusionner avec les existantes, en limitant le nombre total
                const combined = [...prev, ...toDisplay];
                return combined.slice(-maxVisible);
            });

            // Jouer un son si activé
            if (preferences.enableSounds) {
                playNotificationSound(newNotifications[0].priorite);
            }

            // Effacer du contexte après avoir affiché
            clearNewNotifications();
        }
    }, [newNotifications, preferences.enablePopups, preferences.enableSounds, maxVisible, clearNewNotifications]);

    // Auto-fermeture après un délai
    useEffect(() => {
        const timers = displayedNotifications
            .filter(n => n.open)
            .map(n => {
                return setTimeout(() => {
                    handleClose(n.id);
                }, DISPLAY_DURATION);
            });

        return () => timers.forEach(timer => clearTimeout(timer));
    }, [displayedNotifications]);

    const handleClose = (id: string) => {
        setDisplayedNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, open: false } : n))
        );

        // Supprimer après l'animation
        setTimeout(() => {
            setDisplayedNotifications(prev => prev.filter(n => n.id !== id));
        }, 300);
    };

    const handleAction = (notification: NotificationMentor) => {
        markAsRead(notification.id);
        handleClose(notification.id);

        if (notification.actionUrl) {
            router.push(notification.actionUrl);
        }
    };

    return (
        <Stack
            spacing={1}
            sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 9999,
                maxWidth: 400,
            }}
        >
            {displayedNotifications.map((item, index) => (
                <Slide
                    key={item.id}
                    direction="left"
                    in={item.open}
                    mountOnEnter
                    unmountOnExit
                >
                    <Snackbar
                        open={item.open}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        sx={{
                            position: 'relative',
                            bottom: `${index * 80}px !important`,
                            right: '0 !important',
                        }}
                    >
                        <Alert
                            severity={getNotificationSeverity(item.notification)}
                            variant="filled"
                            sx={{
                                width: '100%',
                                boxShadow: 3,
                                '& .MuiAlert-message': {
                                    width: '100%',
                                },
                            }}
                            action={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    {item.notification.actionUrl && (
                                        <IconButton
                                            size="small"
                                            aria-label="view"
                                            color="inherit"
                                            onClick={() => handleAction(item.notification)}
                                            sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                                        >
                                            <LaunchIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    <IconButton
                                        size="small"
                                        aria-label="close"
                                        color="inherit"
                                        onClick={() => handleClose(item.id)}
                                        sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            }
                        >
                            <AlertTitle sx={{ fontWeight: 600 }}>
                                {item.notification.titre}
                            </AlertTitle>
                            {item.notification.message}
                        </Alert>
                    </Snackbar>
                </Slide>
            ))}
        </Stack>
    );
}
