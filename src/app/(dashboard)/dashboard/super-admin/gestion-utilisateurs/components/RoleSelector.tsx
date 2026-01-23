'use client';

import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from '@mui/material';

interface Role {
  id: number;
  name: string;
  description?: string;
}

interface RoleSelectorProps {
  roles: Role[];
  onRoleChange: (roleId: number | number[] | undefined) => void;
  value?: number | number[] | undefined;
  allowMultiple?: boolean;
  error?: string;
  helperText?: string;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  roles, 
  onRoleChange, 
  value, 
  allowMultiple = false,
  error,
  helperText
}) => {
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  console.log('RoleSelector - value reçu:', value);
  console.log('RoleSelector - isMultiSelect:', isMultiSelect);
  console.log('RoleSelector - roles disponibles:', roles);

  const handleMultiSelectToggle = (checked: boolean) => {
    console.log('RoleSelector - handleMultiSelectToggle - checked:', checked);
    console.log('RoleSelector - handleMultiSelectToggle - value avant changement:', value);
    
    setIsMultiSelect(checked);
    
    if (checked) {
      // Passage au mode multiple : convertir le rôle unique en tableau
      if (typeof value === 'number' && value > 0) {
        console.log('Conversion rôle unique vers tableau:', [value]);
        onRoleChange([value]);
      } else {
        console.log('Pas de rôle sélectionné, initialisation avec tableau vide');
        onRoleChange([]);
      }
    } else {
      // Passage au mode simple : prendre le premier rôle du tableau
      if (Array.isArray(value) && value.length > 0) {
        console.log('Conversion tableau vers rôle unique:', value[0]);
        onRoleChange(value[0]);
      } else {
        console.log('Pas de rôles dans le tableau, initialisation avec undefined');
        onRoleChange(undefined);
      }
    }
  };

  const handleChange = (e: any) => {
    console.log('RoleSelector - handleChange - e.target.value:', e.target.value);
    if (isMultiSelect) {
      const selectedValues = e.target.value as number[];
      onRoleChange(selectedValues);
    } else {
      const roleId = parseInt(e.target.value);
      console.log('RoleSelector - roleId parsed:', roleId);
      onRoleChange(roleId || undefined);
    }
  };

  const renderValue = (selected: any) => {
    console.log('RoleSelector - renderValue - selected:', selected);
    console.log('RoleSelector - renderValue - isMultiSelect:', isMultiSelect);
    
    if (isMultiSelect) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {(selected as number[]).map((roleId) => {
            const role = roles.find(r => r.id === roleId);
            return (
              <Chip
                key={roleId}
                label={role?.name || `Rôle ${roleId}`}
                size="small"
                sx={{ 
                  fontSize: '0.75rem',
                  height: '24px',
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            );
          })}
        </Box>
      );
    }
    
    // Mode simple : afficher le rôle sélectionné directement dans le champ
    if (selected && selected !== '') {
      const role = roles.find(r => r.id === parseInt(selected));
      console.log('RoleSelector - renderValue - rôle trouvé:', role);
      return role?.name || '';
    }
    
    console.log('RoleSelector - renderValue - pas de sélection');
    return '';
  };

  return (
    <Box>
      <FormControl fullWidth error={!!error}>
        <InputLabel>
          Rôle{isMultiSelect ? 's' : ''} *
        </InputLabel>
        <Select
          multiple={isMultiSelect}
          value={
            isMultiSelect 
              ? (value as number[] || []) 
              : (value as number || '')
          }
          onChange={handleChange}
          input={<OutlinedInput label={`Rôle${isMultiSelect ? 's' : ''} *`} />}
          renderValue={renderValue}
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root': {
                  py: 0.25,
                  minHeight: '28px',
                  '& .MuiListItemText-primary': {
                    fontSize: '0.8rem'
                  }
                }
              }
            }
          }}
        >
          <MenuItem value="" disabled>
            <em>Sélectionner {isMultiSelect ? 'un ou plusieurs rôles' : 'un rôle'}</em>
          </MenuItem>
          {roles.map(role => (
            <MenuItem key={role.id} value={role.id}>
              {isMultiSelect && (
                <Checkbox 
                  checked={Array.isArray(value) && value.includes(role.id)} 
                  size="small"
                  sx={{ 
                    mr: 0.5,
                    py: 0.25
                  }}
                />
              )}
              <ListItemText 
                primary={role.name}
                primaryTypographyProps={{
                  variant: 'body2',
                  sx: { 
                    fontSize: '0.8rem',
                    lineHeight: 1.2
                  }
                }}
              />
            </MenuItem>
          ))}
        </Select>
        {helperText && (
          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
            {helperText}
          </Typography>
        )}
        {error && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            {error}
          </Typography>
        )}
      </FormControl>
      
      <Box sx={{ mt: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isMultiSelect}
              onChange={(e) => handleMultiSelectToggle(e.target.checked)}
              size="small"
            />
          }
          label={
            <Typography variant="caption">
              Permettre la sélection multiple de rôles
            </Typography>
          }
        />
        {isMultiSelect && (
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', ml: 4 }}>
            Cliquez sur les rôles pour les sélectionner
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default RoleSelector;
