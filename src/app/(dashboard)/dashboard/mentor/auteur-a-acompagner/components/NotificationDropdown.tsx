'use client';

import { useState } from 'react';
import {
    IconButton,
    Badge,
    Menu,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Box,
    Button,
    Divider,
    Chip,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    NotificationsActive as NotificationsActiveIcon,
    MarkEmailRead as MarkEmailReadIcon,
    Launch as LaunchIcon,
    Forum as ForumIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Description as DescriptionIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useNotifications } from '../contexts/NotificationContext';
import { NotificationMentor } from '../fetchers/useFetchAuteurAAcompagner';
import { formatDernierContact, getPrioriteColor } from '../helpers/formatters';
import { getNotificationTypeColor } from '../helpers/notificationUtils';

const MAX_DISPLAYED = 5;

function getNotificationIcon(type: string) {
    switch (type) {
        case 'decision_editeur':
            return <CheckCircleIcon />;
        case 'delai_depasse':
            return <WarningIcon />;
        case 'manuscrit_soumis':
            return <DescriptionIcon />;
        case 'echange_nouveau':
        default:
            return <ForumIcon />;
    }
}

export default function NotificationDropdown() {
    const router = useRouter();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // Trier les notifications par date (plus récentes d'abord)
    const sortedNotifications = [...notifications]
        .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
        .slice(0, MAX_DISPLAYED);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (notification: NotificationMentor) => {
        markAsRead(notification.id);
        handleClose();

        if (notification.actionUrl) {
            router.push(notification.actionUrl);
        }
    };

    const handleViewAll = () => {
        handleClose();
        router.push('/dashboard/mentor/notifications');
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                size="large"
                aria-label={`${unreadCount} nouvelles notifications`}
                aria-controls={open ? 'notification-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{
                    color: unreadCount > 0 ? 'primary.main' : 'inherit',
                    transition: 'all 0.3s',
                    '&:hover': {
                        transform: 'scale(1.1)',
                    },
                }}
            >
                <Badge
                    badgeContent={unreadCount}
                    color="error"
                    max={99}
                    sx={{
                        '& .MuiBadge-badge': {
                            animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                            '@keyframes pulse': {
                                '0%': {
                                    transform: 'scale(1)',
                                    opacity: 1,
                                },
                                '50%': {
                                    transform: 'scale(1.1)',
                                    opacity: 0.8,
                                },
                                '100%': {
                                    transform: 'scale(1)',
                                    opacity: 1,
                                },
                            },
                        },
                    }}
                >
                    {unreadCount > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
                </Badge>
            </IconButton>

            <Menu
                id="notification-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        mt: 1.5,
                        minWidth: 400,
                        maxWidth: 500,
                        maxHeight: 600,
                        overflow: 'visible',
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* Header */}
                <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Notifications
                    </Typography>
                    {unreadCount > 0 && (
                        <Button
                            size="small"
                            startIcon={<MarkEmailReadIcon />}
                            onClick={handleMarkAllAsRead}
                            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                        >
                            Tout marquer comme lu
                        </Button>
                    )}
                </Box>

                <Divider />

                {/* Notifications list */}
                {sortedNotifications.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            Aucune notification
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
                        {sortedNotifications.map((notification, index) => (
                            <Box key={notification.id}>
                                <ListItemButton
                                    onClick={() => handleNotificationClick(notification)}
                                    sx={{
                                        py: 1.5,
                                        px: 2,
                                        bgcolor: notification.lu ? 'transparent' : 'primary.50',
                                        borderLeft: notification.lu ? 'none' : 3,
                                        borderLeftColor: 'primary.main',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: notification.lu ? 'grey.50' : 'primary.100',
                                        },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            sx={{
                                                bgcolor: `${getNotificationTypeColor(notification.type)}.main`,
                                                width: 40,
                                                height: 40,
                                            }}
                                        >
                                            {getNotificationIcon(notification.type)}
                                        </Avatar>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, pr: 1 }}>
                                                    {notification.titre}
                                                </Typography>
                                                <Chip
                                                    label={notification.priorite}
                                                    color={getPrioriteColor(notification.priorite)}
                                                    size="small"
                                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {notification.message}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDernierContact(notification.dateCreation)}
                                                </Typography>
                                            </Box>
                                        }
                                    />

                                    {notification.actionUrl && (
                                        <LaunchIcon sx={{ fontSize: 16, color: 'text.secondary', ml: 1 }} />
                                    )}
                                </ListItemButton>
                                {index < sortedNotifications.length - 1 && <Divider variant="inset" component="li" />}
                            </Box>
                        ))}
                    </List>
                )}

                {/* Footer */}
                {notifications.length > MAX_DISPLAYED && (
                    <>
                        <Divider />
                        <Box sx={{ p: 1.5, textAlign: 'center' }}>
                            <Button
                                fullWidth
                                onClick={handleViewAll}
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                                Voir toutes les notifications ({notifications.length})
                            </Button>
                        </Box>
                    </>
                )}
            </Menu>
        </>
    );
}
