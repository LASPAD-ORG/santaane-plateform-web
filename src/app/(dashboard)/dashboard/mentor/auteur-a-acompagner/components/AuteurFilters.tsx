'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Button,
  Collapse,
  IconButton,
  Divider,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  MenuBook as MenuBookIcon,
  Info as InfoIcon,
  Person as PersonIcon
} from '@mui/icons-material';

export interface FilterOptions {
  searchTerm: string;
  statut: string;
  specialite: string;
  nombreManuscritsMin: number | null;
  nombreManuscritsMax: number | null;
  dernierContactDays: number | null;
  statutManuscrit: string;
}

interface AuteurFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  totalResults: number;
  availableSpecialites: string[];
}

const STATUT_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'actif', label: 'Actif' },
  { value: 'inactif', label: 'Inactif' },
  { value: 'suspendu', label: 'Suspendu' }
];

const STATUT_MANUSCRIT_OPTIONS = [
  { value: '', label: 'Tous les manuscrits' },
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'publie', label: 'Publié' },
  { value: 'archive', label: 'Archivé' }
];

const DERNIER_CONTACT_OPTIONS = [
  { value: '', label: 'Toutes les périodes' },
  { value: 7, label: 'Dernière semaine' },
  { value: 30, label: 'Dernier mois' },
  { value: 90, label: 'Derniers 3 mois' },
  { value: 365, label: 'Dernière année' }
];

export default function AuteurFilters({ 
  onFiltersChange, 
  totalResults, 
  availableSpecialites 
}: AuteurFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    statut: '',
    specialite: '',
    nombreManuscritsMin: null,
    nombreManuscritsMax: null,
    dernierContactDays: null,
    statutManuscrit: ''
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Calculer le nombre de filtres actifs
    const activeCount = Object.entries(updatedFilters).reduce((count, [key, value]) => {
      if (key === 'searchTerm' && value) return count + 1;
      if (key !== 'searchTerm' && value !== null && value !== '') return count + 1;
      return count;
    }, 0);
    
    setActiveFiltersCount(activeCount);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      searchTerm: '',
      statut: '',
      specialite: '',
      nombreManuscritsMin: null,
      nombreManuscritsMax: null,
      dernierContactDays: null,
      statutManuscrit: ''
    };
    setFilters(clearedFilters);
    setActiveFiltersCount(0);
    onFiltersChange(clearedFilters);
  };

  const specialiteOptions = [
    { value: '', label: 'Toutes les spécialités' },
    ...availableSpecialites.map(spec => ({ value: spec, label: spec }))
  ];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      {/* Header avec recherche et toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Rechercher par nom, prénom ou email..."
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1, maxWidth: 400 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            {totalResults} résultat{totalResults > 1 ? 's' : ''}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} filtre${activeFiltersCount > 1 ? 's' : ''}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterIcon />}
            endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{ minWidth: 'auto' }}
          >
            Filtres
          </Button>
          
          {activeFiltersCount > 0 && (
            <IconButton 
              size="small" 
              onClick={clearFilters}
              title="Effacer tous les filtres"
            >
              <ClearIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Filtres avancés */}
      <Collapse in={isExpanded}>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {/* Statut auteur */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Statut</InputLabel>
              <Select
                value={filters.statut}
                label="Statut"
                onChange={(e) => updateFilters({ statut: e.target.value })}
              >
                {STATUT_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Spécialité */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Spécialité</InputLabel>
              <Select
                value={filters.specialite}
                label="Spécialité"
                onChange={(e) => updateFilters({ specialite: e.target.value })}
              >
                {specialiteOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Dernier contact */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Dernier contact</InputLabel>
              <Select
                value={filters.dernierContactDays || ''}
                label="Dernier contact"
                onChange={(e) => updateFilters({ 
                  dernierContactDays: e.target.value ? Number(e.target.value) : null 
                })}
              >
                {DERNIER_CONTACT_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Statut manuscrit */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Statut manuscrit</InputLabel>
              <Select
                value={filters.statutManuscrit}
                label="Statut manuscrit"
                onChange={(e) => updateFilters({ statutManuscrit: e.target.value })}
              >
                {STATUT_MANUSCRIT_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Section Filtres numériques avec aide */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon sx={{ fontSize: 16 }} />
              Filtres par productivité - Laissez vide pour ignorer le filtre
            </Typography>
          </Grid>

          {/* Nombre de manuscrits min */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Tooltip title="Exemple: 2 = auteurs avec 2 manuscrits ou plus (productifs)" arrow>
              <TextField
                fullWidth
                size="small"
                label="Min manuscrits"
                type="number"
                placeholder="ex: 2"
                value={filters.nombreManuscritsMin || ''}
                onChange={(e) => updateFilters({ 
                  nombreManuscritsMin: e.target.value ? Number(e.target.value) : null 
                })}
                inputProps={{ min: 0, max: 20 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MenuBookIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                helperText={filters.nombreManuscritsMin ? `≥ ${filters.nombreManuscritsMin} manuscrit${filters.nombreManuscritsMin > 1 ? 's' : ''}` : ""}
              />
            </Tooltip>
          </Grid>

          {/* Nombre de manuscrits max */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Tooltip title="Exemple: 5 = auteurs avec 5 manuscrits ou moins (charge gérable)" arrow>
              <TextField
                fullWidth
                size="small"
                label="Max manuscrits"
                type="number"
                placeholder="ex: 5"
                value={filters.nombreManuscritsMax || ''}
                onChange={(e) => updateFilters({ 
                  nombreManuscritsMax: e.target.value ? Number(e.target.value) : null 
                })}
                inputProps={{ min: 0, max: 20 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MenuBookIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                helperText={filters.nombreManuscritsMax ? `≤ ${filters.nombreManuscritsMax} manuscrit${filters.nombreManuscritsMax > 1 ? 's' : ''}` : ""}
              />
            </Tooltip>
          </Grid>

          {/* Exemples d'utilisation */}
          {(filters.nombreManuscritsMin || filters.nombreManuscritsMax) && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ p: 2, bgcolor: 'success.main', color: 'success.contrastText', borderRadius: 1, mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  📚 Filtre de productivité actif :
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                  {filters.nombreManuscritsMin && (
                    <Chip
                      size="small"
                      icon={<PersonIcon sx={{ fontSize: 16 }} />}
                      label={`Auteurs avec ≥ ${filters.nombreManuscritsMin} manuscrit${filters.nombreManuscritsMin > 1 ? 's' : ''}`}
                      sx={{ bgcolor: 'success.dark', color: 'success.contrastText' }}
                    />
                  )}
                  {filters.nombreManuscritsMax && (
                    <Chip
                      size="small"
                      icon={<PersonIcon sx={{ fontSize: 16 }} />}
                      label={`Auteurs avec ≤ ${filters.nombreManuscritsMax} manuscrit${filters.nombreManuscritsMax > 1 ? 's' : ''}`}
                      sx={{ bgcolor: 'success.dark', color: 'success.contrastText' }}
                    />
                  )}
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {filters.nombreManuscritsMin && filters.nombreManuscritsMax 
                      ? `Auteurs ayant entre ${filters.nombreManuscritsMin} et ${filters.nombreManuscritsMax} manuscrits`
                      : filters.nombreManuscritsMin 
                        ? "Auteurs productifs avec plusieurs œuvres"
                        : "Auteurs avec charge de travail limitée"
                    }
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </Collapse>
    </Paper>
  );
}