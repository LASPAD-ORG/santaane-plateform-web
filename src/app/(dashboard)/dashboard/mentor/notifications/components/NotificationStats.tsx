'use client';

import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import {
    Notifications as NotificationsIcon,
    NotificationsActive as NotificationsActiveIcon,
    Warning as WarningIcon,
    Today as TodayIcon,
    DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { getNotificationStats, NotificationStats } from '../../auteur-a-acompagner/helpers/notificationUtils';
import { NotificationMentor } from '../../auteur-a-acompagner/fetchers/useFetchAuteurAAcompagner';
import { getNotificationTypeLabel } from '../../auteur-a-acompagner/helpers/notificationUtils';

interface NotificationStatsProps {
    notifications: NotificationMentor[];
}

export default function NotificationStatsComponent({ notifications }: NotificationStatsProps) {
    const stats = getNotificationStats(notifications);

    const statCards = [
        {
            icon: <NotificationsIcon sx={{ fontSize: 32 }} />,
            label: 'Total',
            value: stats.total,
            color: 'primary.main',
            bgColor: 'primary.light',
        },
        {
            icon: <NotificationsActiveIcon sx={{ fontSize: 32 }} />,
            label: 'Non lues',
            value: stats.nonLues,
            color: 'error.main',
            bgColor: 'error.light',
        },
        {
            icon: <WarningIcon sx={{ fontSize: 32 }} />,
            label: 'Urgentes',
            value: stats.urgentes,
            color: 'warning.main',
            bgColor: 'warning.light',
        },
        {
            icon: <TodayIcon sx={{ fontSize: 32 }} />,
            label: "Aujourd'hui",
            value: stats.aujourdhui,
            color: 'info.main',
            bgColor: 'info.light',
        },
        {
            icon: <DateRangeIcon sx={{ fontSize: 32 }} />,
            label: 'Cette semaine',
            value: stats.derniereSemaine,
            color: 'success.main',
            bgColor: 'success.light',
        },
    ];

    return (
        <Box>
            {/* Cartes de statistiques principales */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {statCards.map((stat, index) => (
                    <Grid key={index} size={{ xs: 6, sm: 4, md: 2.4 }}>
                        <Card sx={{ bgcolor: stat.bgColor, border: '1px solid', borderColor: stat.color }}>
                            <CardContent sx={{ p: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
                                <Box sx={{ color: stat.color, mb: 1 }}>
                                    {stat.icon}
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mb: 0.5 }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                    {stat.label}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Répartition par type et priorité */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                Par type
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {Object.entries(stats.parType).map(([type, count]) => (
                                    <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2">
                                            {getNotificationTypeLabel(type as any)}
                                        </Typography>
                                        <Chip
                                            label={count}
                                            size="small"
                                            sx={{ fontWeight: 600, minWidth: 40 }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                Par priorité
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {Object.entries(stats.parPriorite).map(([priorite, count]) => (
                                    <Box key={priorite} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                            {priorite === 'high' ? 'Haute' : priorite === 'medium' ? 'Moyenne' : 'Basse'}
                                        </Typography>
                                        <Chip
                                            label={count}
                                            size="small"
                                            color={priorite === 'high' ? 'error' : priorite === 'medium' ? 'warning' : 'default'}
                                            sx={{ fontWeight: 600, minWidth: 40 }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
