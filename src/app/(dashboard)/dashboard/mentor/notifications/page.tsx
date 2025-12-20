'use client';

import { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Pagination,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Sort as SortIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useNotifications } from '../auteur-a-acompagner/contexts/NotificationContext';
import NotificationFilters from './components/NotificationFilters';
import NotificationStats from './components/NotificationStats';
import NotificationList from './components/NotificationList';
import {
    filterNotifications,
    sortNotifications,
    NotificationFilters as NotificationFiltersType,
    NotificationSortField,
    NotificationSortDirection,
} from './helpers/notificationUtils';

const ITEMS_PER_PAGE = 10;

export default function NotificationsPage() {
    const router = useRouter();
    const {
        notifications,
        markAsRead,
        archiveNotification,
        deleteNotification
    } = useNotifications();

    const [filters, setFilters] = useState<NotificationFiltersType>({
        search: '',
        type: '',
        priority: '',
        status: '',
        dateRange: '',
    });
    const [sortField, setSortField] = useState<NotificationSortField>('date');
    const [sortDirection, setSortDirection] = useState<NotificationSortDirection>('desc');
    const [currentPage, setCurrentPage] = useState(1);

    // Filtrer et trier les notifications
    const filteredNotifications = useMemo(() => {
        return filterNotifications(notifications, filters);
    }, [notifications, filters]);

    const sortedNotifications = useMemo(() => {
        return sortNotifications(filteredNotifications, sortField, sortDirection);
    }, [filteredNotifications, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(sortedNotifications.length / ITEMS_PER_PAGE);
    const paginatedNotifications = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [sortedNotifications, currentPage]);

    const handleFiltersChange = (newFilters: NotificationFiltersType) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to page 1 when filters change
    };

    const handleMarkAsUnread = (id: string) => {
        // Create opposite action - for now just log
        console.log('Mark as unread:', id);
        // TODO: Implement in context if needed
    };

    const handlePageChange = (_: any, page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortFieldChange = (field: NotificationSortField) => {
        if (sortField === field) {
            // Inverser la direction si on clique sur le même champ
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
        setCurrentPage(1);
    };

    return (
        <Box sx={{ maxWidth: '1400px', mx: 'auto', p: { xs: 2, md: 3 } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.back()}
                    sx={{ textTransform: 'none' }}
                >
                    Retour
                </Button>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                        Centre de Notifications
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Gérez toutes vos notifications de mentorat en un seul endroit
                    </Typography>
                </Box>
            </Box>

            {/* Statistics */}
            <NotificationStats notifications={notifications} />

            {/* Filters */}
            <Box sx={{ my: 3 }}>
                <NotificationFilters
                    onFiltersChange={handleFiltersChange}
                    totalResults={sortedNotifications.length}
                />
            </Box>

            {/* Sort options */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SortIcon color="action" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Trier par :
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Critère</InputLabel>
                        <Select
                            value={sortField}
                            label="Critère"
                            onChange={(e) => handleSortFieldChange(e.target.value as NotificationSortField)}
                        >
                            <MenuItem value="date">Date</MenuItem>
                            <MenuItem value="priorite">Priorité</MenuItem>
                            <MenuItem value="type">Type</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Ordre</InputLabel>
                        <Select
                            value={sortDirection}
                            label="Ordre"
                            onChange={(e) => setSortDirection(e.target.value as NotificationSortDirection)}
                        >
                            <MenuItem value="desc">Décroissant</MenuItem>
                            <MenuItem value="asc">Croissant</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Typography variant="caption" color="text.secondary">
                    Affichage {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, sortedNotifications.length)} sur {sortedNotifications.length}
                </Typography>
            </Paper>

            {/* Notifications List */}
            <NotificationList
                notifications={paginatedNotifications}
                onMarkAsRead={markAsRead}
                onMarkAsUnread={handleMarkAsUnread}
                onArchive={archiveNotification}
                onDelete={deleteNotification}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Box>
    );
}
