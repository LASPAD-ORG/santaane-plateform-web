'use client';

import { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Grid,
    InputAdornment,
    Chip,
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import { NotificationFilters } from '../helpers/notificationUtils';

interface NotificationFiltersProps {
    onFiltersChange: (filters: NotificationFilters) => void;
    totalResults: number;
}

export default function NotificationFiltersComponent({
    onFiltersChange,
    totalResults
}: NotificationFiltersProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [type, setType] = useState<string>('');
    const [priorite, setPriorite] = useState<string>('');
    const [statut, setStatut] = useState<string>('');

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (searchTerm) count++;
        if (type) count++;
        if (priorite) count++;
        if (statut) count++;
        return count;
    }, [searchTerm, type, priorite, statut]);

    const handleApplyFilters = () => {
        const filters: NotificationFilters = {
            search: searchTerm || '',
            type: type || '',
            priority: priorite || '',
            status: statut || '',
            dateRange: '',
        };
        onFiltersChange(filters);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setType('');
        setPriorite('');
        setStatut('');
        onFiltersChange({
            search: '',
            type: '',
            priority: '',
            status: '',
            dateRange: '',
        });
    };

    return (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FilterListIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Filtres
                    </Typography>
                    {activeFiltersCount > 0 && (
                        <Chip
                            label={`${activeFiltersCount} filtre(s) actif(s)`}
                            size="small"
                            color="primary"
                        />
                    )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                    {totalResults} résultat{totalResults > 1 ? 's' : ''}
                </Typography>
            </Box>

            <Grid container spacing={2}>
                {/* Recherche textuelle */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Rechercher"
                        placeholder="Titre, message..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ borderRadius: 2 }}
                    />
                </Grid>

                {/* Type */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={type}
                            label="Type"
                            onChange={(e) => setType(e.target.value)}
                        >
                            <MenuItem value="">Tous</MenuItem>
                            <MenuItem value="echange_nouveau">Nouvel échange</MenuItem>
                            <MenuItem value="decision_editeur">Décision éditeur</MenuItem>
                            <MenuItem value="delai_depasse">Délai dépassé</MenuItem>
                            <MenuItem value="manuscrit_soumis">Manuscrit soumis</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Priorité */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel>Priorité</InputLabel>
                        <Select
                            value={priorite}
                            label="Priorité"
                            onChange={(e) => setPriorite(e.target.value)}
                        >
                            <MenuItem value="">Toutes</MenuItem>
                            <MenuItem value="high">Haute</MenuItem>
                            <MenuItem value="medium">Moyenne</MenuItem>
                            <MenuItem value="low">Basse</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Statut */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel>Statut</InputLabel>
                        <Select
                            value={statut}
                            label="Statut"
                            onChange={(e) => setStatut(e.target.value)}
                        >
                            <MenuItem value="">Tous</MenuItem>
                            <MenuItem value="non_lu">Non lues</MenuItem>
                            <MenuItem value="lu">Lues</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Boutons d'action */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleApplyFilters}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                            Appliquer
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleClearFilters}
                            startIcon={<ClearIcon />}
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                            Réinitialiser
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}
