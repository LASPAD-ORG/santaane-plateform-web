'use client';

import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  IconButton
} from '@mui/material';
import {
  Sort as SortIcon,
  SwapVert as SwapVertIcon
} from '@mui/icons-material';

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

interface AuteurSortOptionsProps {
  sortOptions: SortOptions;
  onSortChange: (sortOptions: SortOptions) => void;
}

const SORT_FIELDS = [
  { value: 'nom', label: 'Nom' },
  { value: 'dateInscription', label: 'Date d\'inscription' },
  { value: 'dernierContact', label: 'Dernier contact' },
  { value: 'nombreManuscrits', label: 'Nombre de manuscrits' },
  { value: 'statut', label: 'Statut' }
];

export default function AuteurSortOptions({ 
  sortOptions, 
  onSortChange 
}: AuteurSortOptionsProps) {
  const handleFieldChange = (field: string) => {
    onSortChange({ ...sortOptions, field });
  };

  const handleDirectionToggle = () => {
    onSortChange({ 
      ...sortOptions, 
      direction: sortOptions.direction === 'asc' ? 'desc' : 'asc' 
    });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <SortIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
        Trier par :
      </Typography>
      
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <Select
          value={sortOptions.field}
          onChange={(e) => handleFieldChange(e.target.value)}
          variant="outlined"
        >
          {SORT_FIELDS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <IconButton 
        size="small" 
        onClick={handleDirectionToggle}
        title={`Trier par ordre ${sortOptions.direction === 'asc' ? 'décroissant' : 'croissant'}`}
        sx={{ 
          transform: sortOptions.direction === 'desc' ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s ease'
        }}
      >
        <SwapVertIcon />
      </IconButton>
    </Box>
  );
}