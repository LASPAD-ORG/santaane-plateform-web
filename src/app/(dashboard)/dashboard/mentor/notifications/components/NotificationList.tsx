'use client';

import { useState } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    Chip,
    IconButton,
    Checkbox,
    Collapse,
    Button,
    Paper,
} from '@mui/material';
import {
    Forum as ForumIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Description as DescriptionIcon,
    Launch as LaunchIcon,
    ExpandMore as ExpandMoreIcon,
    Delete as DeleteIcon,
    Archive as ArchiveIcon,
    MarkEmailRead as MarkEmailReadIcon,
    MarkEmailUnread as MarkEmailUnreadIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { 
    Notification, 
    getNotificationTypeColor,
    formatNotificationDate,
    getNotificationPriorityColor
} from '../helpers/notificationUtils';

// Fonctions utilitaires pour la compatibilité
const getNotificationTitle = (notification: Notification) => 
    notification.title || notification.titre || 'Notification';

const getNotificationDate = (notification: Notification) => 
    notification.createdAt || notification.dateCreation || '';

const getNotificationPriority = (notification: Notification) => 
    notification.priority || notification.priorite || 'LOW';

const isNotificationRead = (notification: Notification) => 
    notification.status === 'READ' || notification.lu === true;

interface NotificationListProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAsUnread: (id: string) => void;
    onArchive: (id: string) => void;
    onDelete: (id: string) => void;
}

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

export default function NotificationList({
    notifications,
    onMarkAsRead,
    onMarkAsUnread,
    onArchive,
    onDelete,
}: NotificationListProps) {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleToggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedIds.size === notifications.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(notifications.map(n => n.id)));
        }
    };

    const handleBulkAction = (action: 'read' | 'unread' | 'archive' | 'delete') => {
        selectedIds.forEach(id => {
            switch (action) {
                case 'read':
                    onMarkAsRead(id);
                    break;
                case 'unread':
                    onMarkAsUnread(id);
                    break;
                case 'archive':
                    onArchive(id);
                    break;
                case 'delete':
                    onDelete(id);
                    break;
            }
        });
        setSelectedIds(new Set());
    };

    const handleExpandClick = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleNotificationClick = (notification: Notification) => {
        if (notification.actionUrl) {
            router.push(notification.actionUrl);
        }
    };

    if (notifications.length === 0) {
        return (
            <Paper
                variant="outlined"
                sx={{
                    p: 4,
                    textAlign: 'center',
                    bgcolor: 'grey.50',
                    border: '1px dashed',
                    borderColor: 'grey.300'
                }}
            >
                <DescriptionIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Aucune notification
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Les notifications apparaîtront ici.
                </Typography>
            </Paper>
        );
    }

    return (
        <Box>
            {/* Actions en masse */}
            {selectedIds.size > 0 && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.light', border: '1px solid', borderColor: 'primary.main' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {selectedIds.size} notification(s) sélectionnée(s)
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button
                                size="small"
                                startIcon={<MarkEmailReadIcon />}
                                onClick={() => handleBulkAction('read')}
                                sx={{ textTransform: 'none' }}
                            >
                                Marquer comme lu
                            </Button>
                            <Button
                                size="small"
                                startIcon={<MarkEmailUnreadIcon />}
                                onClick={() => handleBulkAction('unread')}
                                sx={{ textTransform: 'none' }}
                            >
                                Marquer comme non lu
                            </Button>
                            <Button
                                size="small"
                                startIcon={<ArchiveIcon />}
                                onClick={() => handleBulkAction('archive')}
                                sx={{ textTransform: 'none' }}
                            >
                                Archiver
                            </Button>
                            <Button
                                size="small"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleBulkAction('delete')}
                                color="error"
                                sx={{ textTransform: 'none' }}
                            >
                                Supprimer
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            )}

            {/* Bouton sélectionner tout */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                <Button
                    size="small"
                    onClick={handleSelectAll}
                    sx={{ textTransform: 'none' }}
                >
                    {selectedIds.size === notifications.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                </Button>
            </Box>

            {/* Liste des notifications */}
            <List disablePadding>
                {notifications.map((notification, index) => (
                    <Paper
                        key={notification.id}
                        variant="outlined"
                        sx={{
                            mb: 1,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: isNotificationRead(notification) ? 'divider' : 'primary.main',
                            bgcolor: isNotificationRead(notification) ? 'background.paper' : 'primary.50',
                        }}
                    >
                        <ListItem
                            sx={{
                                alignItems: 'flex-start',
                                py: 2,
                            }}
                        >
                            {/* Checkbox */}
                            <Checkbox
                                checked={selectedIds.has(notification.id)}
                                onChange={() => handleToggleSelect(notification.id)}
                                sx={{ mt: 0.5, mr: 1 }}
                            />

                            {/* Icon */}
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        bgcolor: `${getNotificationTypeColor(notification.type)}.main`,
                                        width: 48,
                                        height: 48,
                                    }}
                                >
                                    {getNotificationIcon(notification.type)}
                                </Avatar>
                            </ListItemAvatar>

                            {/* Content */}
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Box sx={{ flexGrow: 1, pr: 2 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                {getNotificationTitle(notification)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatNotificationDate(getNotificationDate(notification))}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                                            <Chip
                                                label={getNotificationPriority(notification)}
                                                color={getNotificationPriorityColor(getNotificationPriority(notification))}
                                                size="small"
                                            />
                                            {!isNotificationRead(notification) && (
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        bgcolor: 'error.main',
                                                        mt: 1
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                }
                                secondary={
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: expandedId === notification.id ? 'unset' : 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                mb: 1,
                                            }}
                                        >
                                            {notification.message}
                                        </Typography>

                                        {/* Actions */}
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleExpandClick(notification.id)}
                                                title={expandedId === notification.id ? 'Réduire' : 'Développer'}
                                            >
                                                <ExpandMoreIcon
                                                    sx={{
                                                        transform: expandedId === notification.id ? 'rotate(180deg)' : 'rotate(0)',
                                                        transition: 'transform 0.3s'
                                                    }}
                                                />
                                            </IconButton>

                                            <IconButton
                                                size="small"
                                                onClick={() => isNotificationRead(notification) ? onMarkAsUnread(notification.id) : onMarkAsRead(notification.id)}
                                                title={isNotificationRead(notification) ? 'Marquer comme non lu' : 'Marquer comme lu'}
                                                color={isNotificationRead(notification) ? 'default' : 'primary'}
                                            >
                                                {isNotificationRead(notification) ? <MarkEmailUnreadIcon fontSize="small" /> : <MarkEmailReadIcon fontSize="small" />}
                                            </IconButton>

                                            {notification.actionUrl && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleNotificationClick(notification)}
                                                    title="Voir détails"
                                                    color="primary"
                                                >
                                                    <LaunchIcon fontSize="small" />
                                                </IconButton>
                                            )}

                                            <IconButton
                                                size="small"
                                                onClick={() => onArchive(notification.id)}
                                                title="Archiver"
                                                color="warning"
                                            >
                                                <ArchiveIcon fontSize="small" />
                                            </IconButton>

                                            <IconButton
                                                size="small"
                                                onClick={() => onDelete(notification.id)}
                                                title="Supprimer"
                                                color="error"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>

                                        {/* Expanded details */}
                                        <Collapse in={expandedId === notification.id} timeout="auto" unmountOnExit>
                                            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                                    Détails complets :
                                                </Typography>
                                                <Typography variant="body2">
                                                    {notification.message}
                                                </Typography>
                                                {notification.actionUrl && (
                                                    <Button
                                                        size="small"
                                                        startIcon={<LaunchIcon />}
                                                        onClick={() => handleNotificationClick(notification)}
                                                        sx={{ mt: 1, textTransform: 'none' }}
                                                    >
                                                        Accéder
                                                    </Button>
                                                )}
                                            </Box>
                                        </Collapse>
                                    </Box>
                                }
                            />
                        </ListItem>
                    </Paper>
                ))}
            </List>
        </Box>
    );
}
