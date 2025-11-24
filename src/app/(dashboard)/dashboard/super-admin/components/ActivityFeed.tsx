'use client';

import { Paper, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Chip, Box } from '@mui/material';
import {
    Article as ArticleIcon,
    Person as PersonIcon,
    Publish as PublishIcon,
    Book as BookIcon,
} from '@mui/icons-material';
import { recentActivities, Activity } from '../hooks/useDashboardStats';

// Retourne l’icône correspondant au type d’activité
const getActivityIcon = (type: string) => {
    switch (type) {
        case 'submission': return <ArticleIcon />;
        case 'user': return <PersonIcon />;
        case 'publication': return <PublishIcon />;
        case 'volume': return <BookIcon />;
        default: return <ArticleIcon />;
    }
};

// Retourne la couleur correspondant au type d’activité
const getActivityColor = (type: string) => {
    switch (type) {
        case 'submission': return 'primary';
        case 'user': return 'success';
        case 'publication': return 'info';
        case 'volume': return 'warning';
        default: return 'default';
    }
};

// Formate la date en "Il y a X min / h / j"
const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
};

export default function ActivityFeed() {
    return (
        <Paper sx={{ p: 3, height: '100%', maxHeight: 600, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                Activité récente
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Dernières actions sur la plateforme
            </Typography>

            <List>
                {recentActivities.map((activity: Activity) => (
                    <ListItem
                        key={activity.id}
                        sx={{
                            borderLeft: 3,
                            borderColor: `${getActivityColor(activity.type)}.main`,
                            mb: 1,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: `${getActivityColor(activity.type)}.main` }}>
                                {getActivityIcon(activity.type)}
                            </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                            primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="subtitle2" component="div">
                                        {activity.title}
                                    </Typography>

                                    <Chip
                                        label={formatTimestamp(activity.timestamp)}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>
                            }
                            secondary={
                                <>
                                    {/* Correction hydration error : component="span" avec display block */}
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        component="span"
                                        sx={{ display: 'block' }}
                                    >
                                        {activity.description}
                                    </Typography>

                                    {activity.user && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            component="span"
                                            sx={{ display: 'block' }}
                                        >
                                            Par {activity.user.name}
                                        </Typography>
                                    )}
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}
