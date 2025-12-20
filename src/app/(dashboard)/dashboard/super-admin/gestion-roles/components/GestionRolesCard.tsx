'use client';

import { Card, CardContent, CardActions, Typography, Box, Button } from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings,
} from '@mui/icons-material';
import type { GestionRolesItem } from '../fetchers/useFetchGestionRoles';
import { truncateContent } from '../helpers/formatters';

interface GestionRolesCardProps {
  item: GestionRolesItem;
  onView?: (item: GestionRolesItem) => void;
  onEdit?: (item: GestionRolesItem) => void;
  onDelete?: (item: GestionRolesItem) => void;
}

export default function GestionRolesCard({
  item,
  onView,
  onEdit,
  onDelete,
}: GestionRolesCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header with icon */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Settings sx={{ fontSize: 32, color: 'primary.main' }} />
        </Box>

        {/* Name */}
        <Typography variant="h6" component="h3" gutterBottom>
          {item.name}
        </Typography>

        {/* Description */}
        {item.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {truncateContent(item.description, 150)}
          </Typography>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        {onView && (
          <Button
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => onView(item)}
          >
            Voir
          </Button>
        )}
        {onEdit && (
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(item)}
          >
            Modifier
          </Button>
        )}
        {onDelete && (
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(item)}
          >
            Supprimer
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
