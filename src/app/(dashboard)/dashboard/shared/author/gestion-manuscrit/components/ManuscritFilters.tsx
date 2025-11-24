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
  Autocomplete,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Article as ArticleIcon,
  Comment as CommentIcon,
  Description as DescriptionIcon,
  Info as InfoIcon
} from '@mui/icons-material';

export interface ManuscritFilterOptions {
  searchTerm: string;
  status: string;
  auteur: string;
  specialite: string;
  nombreCommentairesMin: number | null;
  nombreCommentairesMax: number | null;
  periodeCreation: string;
  volumeMin: number | null;
  volumeMax: number | null;
}

interface ManuscritFiltersProps {
  onFiltersChange: (filters: ManuscritFilterOptions) => void;
  totalResults: number;
  availableAuthors: Array<{id: string, nom: string, prenom: string}>;
  availableSpecialites: string[];
}

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'publie', label: 'Publié' },
  { value: 'archive', label: 'Archivé' }
];

const PERIODE_CREATION_OPTIONS = [
  { value: '', label: 'Toutes les périodes' },
  { value: '7', label: 'Dernière semaine' },
  { value: '30', label: 'Dernier mois' },
  { value: '90', label: 'Derniers 3 mois' },
  { value: '365', label: 'Dernière année' }
];


export default function ManuscritFilters({ 
  onFiltersChange, 
  totalResults, 
  availableAuthors,
  availableSpecialites
}: ManuscritFiltersProps) {
  const [filters, setFilters] = useState<ManuscritFilterOptions>({
    searchTerm: '',
    status: '',
    auteur: '',
    specialite: '',
    nombreCommentairesMin: null,
    nombreCommentairesMax: null,
    periodeCreation: '',
    volumeMin: null,
    volumeMax: null
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const updateFilters = (newFilters: Partial<ManuscritFilterOptions>) => {
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
    const clearedFilters: ManuscritFilterOptions = {
      searchTerm: '',
      status: '',
      auteur: '',
      specialite: '',
      nombreCommentairesMin: null,
      nombreCommentairesMax: null,
      periodeCreation: '',
      volumeMin: null,
      volumeMax: null
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
            placeholder="Rechercher par titre, description ou contenu..."
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
            <ArticleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
            {totalResults} manuscrit{totalResults > 1 ? 's' : ''}
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
          {/* Statut */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Statut</InputLabel>
              <Select
                value={filters.status}
                label="Statut"
                onChange={(e) => updateFilters({ status: e.target.value })}
              >
                {STATUS_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Auteur */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Autocomplete
              size="small"
              options={availableAuthors}
              getOptionLabel={(option) => `${option.prenom} ${option.nom}`}
              value={availableAuthors.find(a => a.id === filters.auteur) || null}
              onChange={(event, newValue) => {
                updateFilters({ auteur: newValue?.id || '' });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Auteur"
                  placeholder="Sélectionner un auteur"
                />
              )}
              noOptionsText="Aucun auteur trouvé"
            />
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

          {/* Période de création */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Période création</InputLabel>
              <Select
                value={filters.periodeCreation}
                label="Période création"
                onChange={(e) => updateFilters({ periodeCreation: e.target.value })}
              >
                {PERIODE_CREATION_OPTIONS.map(option => (
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
              Filtres numériques - Laissez vide pour ignorer le filtre
            </Typography>
          </Grid>

          {/* Commentaires min */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Tooltip title="Exemple: 5 = manuscrits avec 5 commentaires ou plus" arrow>
              <TextField
                fullWidth
                size="small"
                label="Min commentaires"
                type="number"
                placeholder="ex: 5"
                value={filters.nombreCommentairesMin || ''}
                onChange={(e) => updateFilters({ 
                  nombreCommentairesMin: e.target.value ? Number(e.target.value) : null 
                })}
                inputProps={{ min: 0, max: 100 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CommentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                helperText={filters.nombreCommentairesMin ? `≥ ${filters.nombreCommentairesMin}` : ""}
              />
            </Tooltip>
          </Grid>

          {/* Commentaires max */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Tooltip title="Exemple: 10 = manuscrits avec 10 commentaires ou moins" arrow>
              <TextField
                fullWidth
                size="small"
                label="Max commentaires"
                type="number"
                placeholder="ex: 10"
                value={filters.nombreCommentairesMax || ''}
                onChange={(e) => updateFilters({ 
                  nombreCommentairesMax: e.target.value ? Number(e.target.value) : null 
                })}
                inputProps={{ min: 0, max: 100 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CommentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                helperText={filters.nombreCommentairesMax ? `≤ ${filters.nombreCommentairesMax}` : ""}
              />
            </Tooltip>
          </Grid>

          {/* Volume min (pages) */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Tooltip title="Exemple: 100 = manuscrits de 100 pages ou plus" arrow>
              <TextField
                fullWidth
                size="small"
                label="Min pages"
                type="number"
                placeholder="ex: 100"
                value={filters.volumeMin || ''}
                onChange={(e) => updateFilters({ 
                  volumeMin: e.target.value ? Number(e.target.value) : null 
                })}
                inputProps={{ min: 1, max: 1000 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                helperText={filters.volumeMin ? `≥ ${filters.volumeMin} pages` : ""}
              />
            </Tooltip>
          </Grid>

          {/* Volume max (pages) */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Tooltip title="Exemple: 300 = manuscrits de 300 pages ou moins" arrow>
              <TextField
                fullWidth
                size="small"
                label="Max pages"
                type="number"
                placeholder="ex: 300"
                value={filters.volumeMax || ''}
                onChange={(e) => updateFilters({ 
                  volumeMax: e.target.value ? Number(e.target.value) : null 
                })}
                inputProps={{ min: 1, max: 1000 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                helperText={filters.volumeMax ? `≤ ${filters.volumeMax} pages` : ""}
              />
            </Tooltip>
          </Grid>

          {/* Exemples d'utilisation */}
          {(filters.nombreCommentairesMin || filters.nombreCommentairesMax || filters.volumeMin || filters.volumeMax) && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ p: 2, bgcolor: 'info.main', color: 'info.contrastText', borderRadius: 1, mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  💡 Filtres actifs :
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {filters.nombreCommentairesMin && (
                    <Chip
                      size="small"
                      label={`Commentaires ≥ ${filters.nombreCommentairesMin}`}
                      sx={{ bgcolor: 'info.dark', color: 'info.contrastText' }}
                    />
                  )}
                  {filters.nombreCommentairesMax && (
                    <Chip
                      size="small"
                      label={`Commentaires ≤ ${filters.nombreCommentairesMax}`}
                      sx={{ bgcolor: 'info.dark', color: 'info.contrastText' }}
                    />
                  )}
                  {filters.volumeMin && (
                    <Chip
                      size="small"
                      label={`Pages ≥ ${filters.volumeMin}`}
                      sx={{ bgcolor: 'info.dark', color: 'info.contrastText' }}
                    />
                  )}
                  {filters.volumeMax && (
                    <Chip
                      size="small"
                      label={`Pages ≤ ${filters.volumeMax}`}
                      sx={{ bgcolor: 'info.dark', color: 'info.contrastText' }}
                    />
                  )}
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </Collapse>
    </Paper>
  );
}