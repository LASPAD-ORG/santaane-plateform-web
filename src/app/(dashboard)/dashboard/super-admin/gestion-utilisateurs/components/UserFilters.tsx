'use client';

import {
  Box,
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
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { UserFilters as UserFiltersType, UserStatus } from '../types';
import { UserRole } from '@/types/auth';
import { ROLE_CONFIGS } from '@/config/roles';

interface UserFiltersProps {
  filters: UserFiltersType;
  updateFilters: (newFilters: Partial<UserFiltersType>) => void;
  totalUsers: number;
  filteredCount: number;
}

const STATUS_OPTIONS = [
  { value: UserStatus.ACTIVE, label: 'Actif', color: 'success' },
  { value: UserStatus.INACTIVE, label: 'Inactif', color: 'default' },
  { value: UserStatus.PENDING, label: 'En attente', color: 'warning' },
  { value: UserStatus.SUSPENDED, label: 'Suspendu', color: 'error' },
] as const;

const ROLE_OPTIONS = Object.values(UserRole).map(role => ({
  value: role,
  label: ROLE_CONFIGS[role]?.label || role,
  color: ROLE_CONFIGS[role]?.color || '#757575',
}));

const LABORATOIRE_OPTIONS = [
  { value: 'lab1', label: 'Laboratoire de Recherche 1' },
  { value: 'lab2', label: 'Laboratoire de Recherche 2' },
  { value: 'lab3', label: 'Laboratoire de Biologie' },
  { value: 'lab4', label: 'Laboratoire de Chimie' },
];

const SPECIALITE_OPTIONS = [
  { value: 'informatique', label: 'Informatique' },
  { value: 'biologie', label: 'Biologie' },
  { value: 'chimie', label: 'Chimie' },
  { value: 'physique', label: 'Physique' },
  { value: 'mathematiques', label: 'Mathématiques' },
];

const DERNIERE_CONNEXION_OPTIONS = [
  { value: 'aujourd-hui', label: 'Aujourd\'hui' },
  { value: 'semaine', label: 'Cette semaine' },
  { value: 'mois', label: 'Ce mois' },
  { value: 'trimestre', label: 'Ce trimestre' },
  { value: 'plus-3-mois', label: 'Plus de 3 mois' },
];

export function UserFilters({
  filters,
  updateFilters,
  totalUsers,
  filteredCount,
}: UserFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'search') return !!value;
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  });

  const clearAllFilters = () => {
    updateFilters({
      search: '',
      roles: [],
      status: '',
      laboratoire: '',
      specialite: '',
      dateCreationDebut: '',
      dateCreationFin: '',
      derniereConnexion: '',
    });
  };

  return (
    <Box>
      {/* Barre de recherche principale */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par nom, email, téléphone..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => updateFilters({ search: '' })}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setExpanded(!expanded)}
            fullWidth
          >
            Filtres avancés
          </Button>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="body2" color="text.secondary">
              {filteredCount} / {totalUsers} utilisateurs
            </Typography>
            {hasActiveFilters && (
              <Button
                size="small"
                onClick={clearAllFilters}
                startIcon={<ClearIcon />}
                sx={{ mt: 0.5 }}
              >
                Effacer tout
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Chips des filtres actifs */}
      {hasActiveFilters && (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {filters.roles.length > 0 && (
            <Chip
              label={`Rôles: ${filters.roles.map(role => ROLE_CONFIGS[role]?.label).join(', ')}`}
              onDelete={() => updateFilters({ roles: [] })}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {filters.status && (
            <Chip
              label={`Statut: ${STATUS_OPTIONS.find(s => s.value === filters.status)?.label}`}
              onDelete={() => updateFilters({ status: '' })}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {filters.laboratoire && (
            <Chip
              label={`Laboratoire: ${LABORATOIRE_OPTIONS.find(l => l.value === filters.laboratoire)?.label}`}
              onDelete={() => updateFilters({ laboratoire: '' })}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      )}

      {/* Filtres avancés */}
      <Collapse in={expanded}>
        <Grid container spacing={2}>
          {/* Rôles */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Autocomplete
              multiple
              size="small"
              options={ROLE_OPTIONS}
              getOptionLabel={(option) => option.label}
              value={ROLE_OPTIONS.filter(option => filters.roles.includes(option.value))}
              onChange={(event, newValue) => {
                updateFilters({ roles: newValue.map(v => v.value) });
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.value}
                    label={option.label}
                    size="small"
                    style={{ backgroundColor: option.color + '20', color: option.color }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Rôles"
                  placeholder="Sélectionner des rôles"
                />
              )}
            />
          </Grid>

          {/* Statut */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Statut</InputLabel>
              <Select
                value={filters.status}
                label="Statut"
                onChange={(e) => updateFilters({ status: e.target.value as UserStatus })}
              >
                <MenuItem value="">
                  <em>Tous les statuts</em>
                </MenuItem>
                {STATUS_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Laboratoire */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Laboratoire</InputLabel>
              <Select
                value={filters.laboratoire}
                label="Laboratoire"
                onChange={(e) => updateFilters({ laboratoire: e.target.value })}
              >
                <MenuItem value="">
                  <em>Tous les laboratoires</em>
                </MenuItem>
                {LABORATOIRE_OPTIONS.map(option => (
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
                <MenuItem value="">
                  <em>Toutes les spécialités</em>
                </MenuItem>
                {SPECIALITE_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>



          {/* Dernière connexion */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Dernière connexion</InputLabel>
              <Select
                value={filters.derniereConnexion}
                label="Dernière connexion"
                onChange={(e) => updateFilters({ derniereConnexion: e.target.value })}
              >
                <MenuItem value="">
                  <em>Toutes les périodes</em>
                </MenuItem>
                {DERNIERE_CONNEXION_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Collapse>
    </Box>
  );
}