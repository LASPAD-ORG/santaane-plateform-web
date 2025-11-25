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

export interface ManuscritSortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

interface ManuscritSortOptionsProps {
  sortOptions: ManuscritSortOptions;
  onSortChange: (sortOptions: ManuscritSortOptions) => void;
}

const SORT_FIELDS = [
  { value: 'title', label: 'Titre' },
  { value: 'createdAt', label: 'Date de création' },
  { value: 'updatedAt', label: 'Dernière modification' },
  { value: 'status', label: 'Statut' },
  { value: 'authorId', label: 'Auteur' },
  { value: 'nombreCommentaires', label: 'Nombre de commentaires' },
  { value: 'volume', label: 'Nombre de pages' }
];

export default function ManuscritSortOptions({ 
  sortOptions, 
  onSortChange 
}: ManuscritSortOptionsProps) {
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
      
      <FormControl size="small" sx={{ minWidth: 160 }}>
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