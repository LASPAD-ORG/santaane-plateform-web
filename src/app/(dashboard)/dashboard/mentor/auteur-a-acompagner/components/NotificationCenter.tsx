'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Paper,
  Skeleton,
  Button
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Forum as ForumIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Description as DescriptionIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  NotificationMentor
} from '../fetchers/useFetchAuteurAAcompagner';
import {
  getNotificationTypeColor,
  formatDernierContact,
  getPrioriteColor
} from '../helpers/formatters';

interface NotificationCenterProps {
  notifications: NotificationMentor[];
  loading?: boolean;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
}

export default function NotificationCenter({
  notifications,
  loading = false,
  onMarkAsRead,
  onMarkAllAsRead
}: NotificationCenterProps) {
  const router = useRouter();
  const [localNotifications, setLocalNotifications] = useState(notifications);

  // Update local state when props change
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const notificationsNonLues = localNotifications.filter(n => !n.lu).length;


  const getNotificationIcon = (type: string) => {
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
  };

  const handleMarkAsRead = (notification: NotificationMentor) => {
    if (!notification.lu) {
      setLocalNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, lu: true } : n)
      );
      onMarkAsRead?.(notification.id);
    }
  };

  const handleMarkAllAsRead = () => {
    setLocalNotifications(prev =>
      prev.map(n => ({ ...n, lu: true }))
    );
    onMarkAllAsRead?.();
  };

  const handleNotificationClick = (notification: NotificationMentor) => {
    handleMarkAsRead(notification);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const sortedNotifications = [...localNotifications].sort(
    (a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
  );

  if (loading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            <Skeleton width={200} />
          </Typography>
          <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1 }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Badge badgeContent={notificationsNonLues} color="error">
            <NotificationsIcon />
          </Badge>
          Notifications ({localNotifications.length})
        </Typography>
        {notificationsNonLues > 0 && (
          <Button
            size="small"
            startIcon={<MarkEmailReadIcon />}
            onClick={handleMarkAllAsRead}
            color="primary"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Tout marquer comme lu
          </Button>
        )}
      </Box>

      {/* Empty state */}
      {localNotifications.length === 0 ? (
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
          <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Aucune notification
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Les nouvelles notifications apparaîtront ici.
          </Typography>
        </Paper>
      ) : (
        /* Notifications List */
        <List disablePadding>
          {sortedNotifications.map((notification, index) => (
            <ListItem
              key={notification.id}
              sx={{
                p: 0,
                mb: 1,
                borderRadius: 2,
                border: '1px solid',
                borderColor: notification.lu ? 'divider' : 'primary.main',
                bgcolor: notification.lu ? 'background.paper' : 'primary.light',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateX(4px)',
                  boxShadow: 2,
                  bgcolor: notification.lu ? 'grey.50' : 'primary.light',
                },
              }}
              onClick={() => handleNotificationClick(notification)}
            >
              <Box sx={{ display: 'flex', width: '100%', p: 2 }}>
                {/* Icon */}
                <Box sx={{ mr: 2, mt: 0.5 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: `${getNotificationTypeColor(notification.type)}.main`
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </Box>

                {/* Content */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {notification.titre}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0, ml: 2 }}>
                      <Chip
                        label={notification.priorite}
                        color={getPrioriteColor(notification.priorite)}
                        size="small"
                      />
                      {!notification.lu && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'error.main'
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.5 }}>
                    {notification.message}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatDernierContact(notification.dateCreation)}
                    </Typography>

                    {notification.actionUrl && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LaunchIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          Voir plus
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      {/* Link to full dashboard */}
      {localNotifications.length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/dashboard/mentor/notifications')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Voir toutes les notifications ({localNotifications.length})
          </Button>
        </Box>
      )}

      {/* Statistics */}
      {localNotifications.length > 0 && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Résumé des notifications
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label={`${localNotifications.length} Total`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${notificationsNonLues} Non lues`}
              size="small"
              color="error"
              variant={notificationsNonLues > 0 ? "filled" : "outlined"}
            />
            <Chip
              label={`${localNotifications.filter(n => n.priorite === 'high').length} Urgentes`}
              size="small"
              color="warning"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}